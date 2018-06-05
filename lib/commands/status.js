const chalk = require('chalk');
const getCrowdinBranch = require('../utils/getCrowdinBranch');
const getTranslationStatus = require('../utils/getTranslationStatus');
const logCommand = require('../utils/logCommand');

function printLanguageStatus(lang, status) {
  console.log(`- ${chalk.green(lang)}`);
  let allTranslated = true;
  Object.entries(status).forEach(([source, { phrases, translated }]) => {
    const fileTranslated = phrases === translated;
    const count = fileTranslated
      ? chalk.green(`${translated} / ${phrases}`)
      : chalk.red(`${translated} / ${phrases}`);
    console.log(`   - ${source}. ${count}`);
    allTranslated = allTranslated && fileTranslated;
  });
  return allTranslated;
}

module.exports = {
  command: 'status',
  aliases: ['$0'],
  describe: 'Get translation status of the current branch',
  async handler(argv) {
    const branch = await getCrowdinBranch(argv);
    logCommand(argv, 'status', branch);
    const translationsStatus = await getTranslationStatus(argv, branch);

    let allTranslated = true;
    Object.entries(translationsStatus).forEach(([lang, status]) => {
      if (!argv.skipValidation.includes(lang)) {
        allTranslated = printLanguageStatus(lang, status) && allTranslated;
      }
    });

    if (argv.skipValidation.length > 0) {
      console.log('');
      console.log(chalk.bold('Ignored languages:'));
      argv.skipValidation.forEach((lang) => {
        printLanguageStatus(lang, translationsStatus[lang]);
      });
    }

    if (allTranslated) {
      console.log(chalk.green('Everything fully translated. Enjoy!'));
      process.exit(0);
    } else {
      console.error(chalk.red('Not fully translated, aborting'));
      process.exit(1);
    }
  },
};
