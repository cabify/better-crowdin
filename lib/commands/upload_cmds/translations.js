const chalk = require('chalk');
const getCrowdinBranch = require('../../utils/getCrowdinBranch');
const getTranslationPaths = require('../../utils/getTranslationPaths');
const getAPI = require('../../api');
const logCommand = require('../../utils/logCommand');

module.exports = {
  command: 'translations',
  describe: 'Uploads the configured translations',
  async handler(argv) {
    const branch = await getCrowdinBranch(argv);

    logCommand(argv, 'upload translations', branch);

    const API = getAPI(argv, branch);
    if (branch) {
      const branches = await API.availableBranches(argv);
      if (!branches.includes(branch)) {
        console.error(chalk.red("Branch doesn't exist. Aborting"));
      }
    }

    const languages = await API.availableLanguages();

    /* eslint-disable */
    for (const lang of languages) {
      process.stdout.write(` - Uploading ${chalk.green(lang)}...`);
      const files = await getTranslationPaths(argv, lang);
      await API.uploadTranslations(lang, files, branch);
      console.log(chalk.green('OK'));
    }
    /* eslint-enable */
  },
};
