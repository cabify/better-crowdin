module.exports = {
  async handler() {
    return new Promise((resolve) => {
      console.log('Sources uploaded');
      resolve();
    });
  },
};
