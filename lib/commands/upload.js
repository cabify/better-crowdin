module.exports = {
  command: 'upload <command>',
  describe: 'Upload sources or translations',
  builder(yargs) {
    return yargs.commandDir('upload_cmds');
  },
  handler() {},
};
