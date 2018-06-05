const chalk = require('chalk');
const getCrowdinBranch = require('../utils/getCrowdinBranch');
const logCommand = require('../utils/logCommand');
const getAPI = require('../api');

module.exports = {
  command: 'delbranch',
  describe: 'Delete the current or the given branch',
  async handler(argv) {
    const branch = await getCrowdinBranch(argv);
    const API = getAPI(argv);

    logCommand(argv, 'delbranch', branch);

    if (branch) {
      try {
        await API.deleteBranch(branch);
        console.log(chalk.green('OK'));
      } catch (e) {
        console.log(chalk.red('ERROR'));
        console.error(chalk.red(e.error.error.message));
        process.exit(1);
      }
    } else {
      console.error(chalk.red('Cannot delete base branch. Aborting'));
      process.exit(1);
    }
  },
};
