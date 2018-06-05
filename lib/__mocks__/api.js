const getAPI = require.requireActual('../api');

const languages = require('./fixtures/languages.json');
const projectInfo = require('./fixtures/projectInfo.json');
const languageStatus = require('./fixtures/languageStatus.json');

module.exports = (argv) => {
  const API = getAPI(argv);
  return {
    ...API,
    async crowdinLanguages() {
      return new Promise((resolve) => {
        resolve(languages);
      });
    },

    async getProjectInfo() {
      return new Promise((resolve) => {
        resolve(projectInfo);
      });
    },

    async languageStatus(lang) {
      return new Promise((resolve) => {
        resolve(languageStatus[lang]);
      });
    },
  };
};
