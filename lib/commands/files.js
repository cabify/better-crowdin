const chalk = require('chalk');
const getTranslationPaths = require('../utils/getTranslationPaths');
const logCommand = require('../utils/logCommand');

module.exports = {
  command: 'files',
  describe: 'list sources and translations files',
  async handler(argv) {
    logCommand(argv, 'files');

    const result = await getTranslationPaths(argv);
    Object.keys(result).forEach((source) => {
      console.log(` - ${chalk.green(source)}`);
      Object.keys(result[source]).forEach((lang) => {
        console.log(`   - ${chalk.green(lang)} ${result[source][lang]}`);
      });
    });
  },
};
