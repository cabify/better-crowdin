const getAPI = require('../api');
const getFile = require('./getFile');
const reduceAsync = require('../utils/async/reduceAsync');

async function getLanguageStatus(API, lang, branch, files) {
  const status = await API.languageStatus(lang);

  return files.reduce((acc, { source }) => {
    const data = getFile(source, branch, status);
    const { phrases, translated } = data || { phrases: 0, translated: 0 };

    acc[source] = {
      phrases: parseInt(phrases, 10),
      translated: parseInt(translated, 10),
    };
    return acc;
  }, {});
}

module.exports = async function getTranslationStatus(argv, branch) {
  const API = getAPI(argv);
  const languages = await API.availableLanguages();

  return reduceAsync(
    languages,
    (lang) => getLanguageStatus(API, lang, branch, argv.files),
    (lang, langStatus, acc) => {
      acc[lang] = langStatus;
      return acc;
    },
    {},
  );
};
