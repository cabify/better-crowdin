const gitBranch = require('git-branch');
const path = require('path');
const getBasePath = require('./getBasePath');

module.exports = async function getCrowdinBranch(argv) {
  const { baseBranches, branch } = argv;

  const targetBranch = branch || await gitBranch(path.dirname(getBasePath(argv)));

  if (targetBranch && !baseBranches.includes(targetBranch)) {
    return targetBranch.replace(/\//g, '_');
  } else {
    return undefined;
  }
};
