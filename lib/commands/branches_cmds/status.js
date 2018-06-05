const chalk = require('chalk');
const logCommand = require('../../utils/logCommand');
const getAPI = require('../../api');
const getTranslationStatus = require('../../utils/getTranslationStatus');
const forEachAsync = require('../../utils/async/forEachAsync');

function printBranchStatus(argv, branch, allTranslated) {
  if (argv.translatedOnly) {
    if (allTranslated) console.log(branch);
  } else {
    const textStatus = allTranslated
      ? chalk.green('TRANSLATED')
      : chalk.red('NOT TRANSLATED');
    console.log(` - ${branch} ${textStatus}`);
  }
}

function isLangTranslated(files) {
  return Object.values(files).every(
    ({ phrases, translated }) => phrases === translated,
  );
}

function isBranchTranslated(argv, status) {
  return Object.entries(status).every(
    ([lang, files]) =>
      argv.skipValidation.includes(lang) || isLangTranslated(files),
  );
}

async function checkBranchStatus(argv, branch) {
  const status = await getTranslationStatus(argv, branch);
  printBranchStatus(argv, branch, isBranchTranslated(argv, status));
}

module.exports = {
  command: 'status',
  describe: 'show all branches status (translated/missing translation)',
  builder(yargs) {
    return yargs.option('translated-only', {
      alias: 't',
      describe: 'Only show translated branches',
    });
  },
  async handler(argv) {
    logCommand(argv, 'branches status');
    const API = getAPI(argv);

    const branches = await API.availableBranches(argv);

    await forEachAsync(branches, (branch) => checkBranchStatus(argv, branch));
  },
};
