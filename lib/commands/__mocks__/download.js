module.exports = {
  async handler() {
    return new Promise((resolve) => {
      console.log('Translations downloaded');
      resolve();
    });
  },
};
