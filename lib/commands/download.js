const chalk = require('chalk');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const getCrowdinBranch = require('../utils/getCrowdinBranch');
const getTranslationPaths = require('../utils/getTranslationPaths');
const getBasePath = require('../utils/getBasePath');
const logCommand = require('../utils/logCommand');
const getAPI = require('../api');
const asyncForEach = require('../utils/async/forEachAsync');

async function downloadFile(url, filePath) {
  return request({ url, encoding: null }).then((res) => {
    fs.writeFileSync(filePath, res);
  });
}

async function downloadLanguage({
  API,
  argv,
  downloadBranch,
  source,
  language,
  destPath,
}) {
  const filePath = path.join(getBasePath(argv), destPath);
  if (argv.dryRun) {
    console.log(`${chalk.gray('[dry-run]')} ${filePath}`);
  } else {
    process.stdout.write(`     - ${destPath}...`);
    const url = API.getDownloadTranslationUrl(downloadBranch, language, source);
    await downloadFile(url, filePath);
    console.log(chalk.green('OK'));
  }
}

async function downloadLanguages({
  API,
  argv,
  downloadBranch,
  source,
  languages,
}) {
  console.log(`   - ${source}`);
  await asyncForEach(
    Object.entries(languages),
    async ([language, destPath]) => {
      await downloadLanguage({
        API,
        argv,
        downloadBranch,
        source,
        language,
        destPath,
      });
    },
  );
}

module.exports = {
  command: 'download',
  describe: 'Download translations',
  async handler(argv) {
    const branch = await getCrowdinBranch(argv);
    logCommand(argv, 'download', branch);

    const translatedPaths = await getTranslationPaths(argv);

    const API = getAPI(argv, branch);

    const branches = await API.availableBranches(argv);
    let downloadBranch = branch;
    if (!branches.includes(branch)) {
      downloadBranch = undefined;
    }

    process.stdout.write(' - Building translations... ');
    const {
      success: { status },
    } = await API.buildTranslations(downloadBranch);
    console.log(chalk.green(status.toUpperCase()));
    console.log(' - Downloading translations');

    await asyncForEach(
      Object.entries(translatedPaths),
      async ([source, languages]) => {
        await downloadLanguages({
          API,
          argv,
          downloadBranch,
          source,
          languages,
        });
      },
    );
  },
};
