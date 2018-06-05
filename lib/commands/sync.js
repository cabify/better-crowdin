const upload = require('./upload_cmds/sources').handler;
const download = require('./download').handler;

module.exports = {
  command: 'sync',
  describe: 'Upload sources to crowdin & download translations',
  async handler(yargs) {
    await upload(yargs);
    await download(yargs);
  },
};
