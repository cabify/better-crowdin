module.exports = {
  command: 'branches <command>',
  describe: 'crowdin branches status',
  builder(yargs) {
    return yargs.commandDir('branches_cmds');
  },
  handler() {},
};
