const chalk = require('chalk');

module.exports = function logCommand(argv, command, branch) {
  let msg = `> ${chalk.bold(argv.$0)} ${chalk.green(command)}`;
  if (branch) {
    msg = `${msg} on ${chalk.cyan(branch)}`;
  }
  if (argv.dryRun) {
    msg = `${chalk.gray('[dry-run]')} ${msg}`;
  }
  if (!argv.porcelain) {
    console.log(msg);
  }
};
