const gitBranch = require('git-branch');
const path = require('path');
const getBasePath = require('./getBasePath');

module.exports = async function getCrowdinBranch(argv) {
  const { baseBranches, branch } = argv;
  const projectBranch = await gitBranch(path.dirname(getBasePath(argv)));

  return new Promise((resolve) => {
    const targetBranch = branch || projectBranch;

    if (!targetBranch || baseBranches.includes(targetBranch)) {
      resolve(undefined);
    } else {
      resolve(targetBranch.replace(/\//g, '_'));
    }
  });
};
