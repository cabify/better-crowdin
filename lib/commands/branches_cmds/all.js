const logCommand = require('../../utils/logCommand');
const getAPI = require('../../api');

module.exports = {
  command: 'all',
  describe: 'show all crowdin branches',
  async handler(argv) {
    logCommand(argv, 'branches all');
    const API = getAPI(argv);

    const branches = await API.availableBranches(argv);

    branches.forEach((branch) => {
      if (argv.porcelain) {
        console.log(branch);
      } else {
        console.log(` - ${branch}`);
      }
    });
  },
};
