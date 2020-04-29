const querystring = require('querystring');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const jq = require('json-query');
const getBasePath = require('./utils/getBasePath');

const BASE_URL = 'https://api.crowdin.com/api/';

const cache = {};

function cleanup(params) {
  // remove undefined values
  return JSON.parse(JSON.stringify(params));
}

function getUri(projectIdentifier, method, params) {
  const queryParams = querystring.stringify(cleanup(params));
  return `${BASE_URL}project/${projectIdentifier}/${method}?${queryParams}`;
}

function getSourceFileConfig(argv, fileConfig) {
  return {
    [`files[${fileConfig.source}]`]: fs.createReadStream(
      path.join(getBasePath(argv), fileConfig.source),
    ),
    [`export_patterns[${fileConfig.source}]`]: `/${fileConfig.translation}`,
  };
}

async function apiCall(argv, method, args = {}, formData) {
  const { projectIdentifier, apiKey } = argv;

  const params = {
    key: apiKey,
    json: true,
    ...args,
  };

  const uri = getUri(projectIdentifier, method, params);

  if (formData) {
    return request.post({
      uri,
      formData,
    });
  }

  return request.post({
    uri,
    json: true,
  });
}

async function dryApiCall(argv, ...rest) {
  if (argv.dryRun) {
    return new Promise((resolve) => resolve());
  }
  return apiCall(argv, ...rest);
}

async function cachedCall(cacheKey, fn) {
  if (cache[cacheKey]) {
    return new Promise((resolve) => {
      resolve(cache[cacheKey]);
    });
  }
  return fn().then((result) => {
    cache[cacheKey] = result;
    return result;
  });
}

module.exports = (argv) => ({
  async crowdinLanguages() {
    return cachedCall('languages', async () =>
      request.get({
        url: `${BASE_URL}supported-languages?json=true`,
        json: true,
      }),
    );
  },

  async getProjectInfo() {
    return cachedCall('info', async () => apiCall(argv, 'info'));
  },

  async availableLanguages() {
    const info = await this.getProjectInfo();
    return info.languages.map((lang) => lang.code);
  },

  async availableBranches() {
    const data = await this.getProjectInfo();
    return jq('files[*node_type=branch].name', {
      data,
    }).value;
  },

  async languageStatus(language) {
    return apiCall(argv, 'language-status', { language });
  },

  async deleteBranch(branch) {
    return dryApiCall(argv, 'delete-directory', { name: '/', branch });
  },

  async createDir(name, branch) {
    return dryApiCall(argv, 'add-directory', { name, recursive: 1, branch });
  },

  async createBranch(name) {
    return dryApiCall(argv, 'add-directory', { name, is_branch: 1 });
  },

  async addFile(fileConfig, branch) {
    return dryApiCall(
      argv,
      'add-file',
      { branch },
      getSourceFileConfig(argv, fileConfig),
    );
  },

  async updateFile(fileConfig, branch) {
    return dryApiCall(
      argv,
      'update-file',
      { branch },
      getSourceFileConfig(argv, fileConfig),
    );
  },

  async uploadTranslations(language, files, branch) {
    const fileConfig = Object.keys(files).reduce((acc, sourceFile) => {
      acc[`files[${sourceFile}]`] = fs.createReadStream(
        path.join(getBasePath(argv), files[sourceFile]),
      );
      return acc;
    }, {});
    return dryApiCall(
      argv,
      'upload-translation',
      { branch, language },
      fileConfig,
    );
  },

  async buildTranslations(branch) {
    return apiCall(argv, 'export', { branch });
  },

  async preTranslate(engine, languages, files, branch) {
    // Crowdin API does not support a branch argument so we add it to the file
    // paths instead.
    const fileSources = files.map(
      (file) => (branch ? `${branch}/${file.source}` : file.source),
    );

    return dryApiCall(
      argv,
      'pre-translate',
      {},
      {
        method: 'mt',
        engine,
        'languages[]': languages,
        'files[]': fileSources,
      },
    );
  },

  getDownloadTranslationUrl(branch, language, file) {
    return getUri(argv.projectIdentifier, 'export-file', {
      key: argv.apiKey,
      language,
      file,
      branch,
    });
  },
});
