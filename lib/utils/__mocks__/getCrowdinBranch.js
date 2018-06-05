module.exports = async function getCrowdinBranch(argv) {
  return new Promise((resolve) => {
    resolve(argv.branch);
  });
};
