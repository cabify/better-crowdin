const chalk = require('chalk');
const path = require('path');
const getCrowdinBranch = require('../../utils/getCrowdinBranch');
const getFile = require('../../utils/getFile');
const getAPI = require('../../api');
const logCommand = require('../../utils/logCommand');

async function checkBranchExists(API, argv, branch) {
  if (branch) {
    const branches = await API.availableBranches(argv);
    if (!branches.includes(branch)) {
      process.stdout.write(`- Creating ${branch}...`);
      await API.createBranch(branch);
      console.log(chalk.green('OK'));
    }
  }
}

async function checkDirExists(API, createdDirs, fileDir, branch, info) {
  if (!getFile(fileDir, branch, info) && !createdDirs.includes(fileDir)) {
    await API.createDir(fileDir, branch);
    return createdDirs.concat([fileDir]);
  }
  return createdDirs;
}

async function uploadFile(API, file, branch, info) {
  if (getFile(file.source, branch, info)) {
    await API.updateFile(file, branch);
  } else {
    await API.addFile(file, branch);
  }
}

module.exports = {
  command: 'sources',
  aliases: ['$0'],
  describe: 'Uploads the configured source files',
  async handler(argv) {
    const branch = await getCrowdinBranch(argv);

    logCommand(argv, 'upload sources', branch);

    const API = getAPI(argv, branch);
    const info = await API.getProjectInfo();
    await checkBranchExists(API, argv, branch);

    let createdDirs = [];
    /* eslint-disable */
    for (const file of argv.files) {
      process.stdout.write(`- ${file.source}...`);
      const fileDir = path.dirname(file.source);
      if (fileDir !== '.') {
        createdDirs = await checkDirExists(
          API,
          createdDirs,
          fileDir,
          branch,
          info,
        );
      }

      await uploadFile(API, file, branch, info);
      console.log(chalk.green('OK'));
    }

    if (
        argv.preTranslationEngine &&
        argv.preTranslationLanguages &&
        argv.preTranslationLanguages.length > 0
    ) {
      process.stdout.write(
        `Pre-translating ${argv.preTranslationLanguages.join(', ')} with ${argv.preTranslationEngine} engine...`
      );
      await API.preTranslate(
        argv.preTranslationEngine,
        argv.preTranslationLanguages,
        argv.files,
        branch,
      );
      console.log(chalk.green('OK'));
    }
    /* eslint-enable */
  },
};
