const path = require('path');
const getCrowdinBranch = require('./getCrowdinBranch');
const getAPI = require('../api');

function swap(obj) {
  if (!obj) {
    return {};
  }
  const ret = {};
  Object.entries(obj).forEach(([key, value]) => {
    ret[value] = key;
  });
  return ret;
}

function findLang(allLanguages, langCode) {
  return allLanguages.find(({ crowdin_code: code }) => langCode === code);
}

function getValue(mapping, key, lang) {
  return mapping && mapping[key] && swap(mapping[key])[lang];
}

function replaceLangVars(allLanguages, source, translation, lang, mapping) {
  const baseLang = findLang(allLanguages, lang);
  const extName = path.extname(source);

  const fileName = [
    {
      key: 'language',
      value: baseLang.name,
    },
    {
      key: 'two_letters_code',
      value: baseLang.iso_639_1,
    },
    {
      key: 'three_letters_code',
      value: baseLang.iso_639_3,
    },
    {
      key: 'locale',
      value: baseLang.locale,
    },
    {
      key: 'locale_with_underscore',
      value: baseLang.locale.replace('-', '_'),
    },
    {
      key: 'android_code',
      value: baseLang.android_code,
    },
    {
      key: 'osx_code',
      value: baseLang.osx_code,
    },
    {
      key: 'osx_locale',
      value: baseLang.locale,
    },
  ].reduce(
    (text, { key, value }) =>
      text.replace(
        new RegExp(`%${key}%`, 'g'),
        getValue(mapping, key, lang) || value,
      ),
    translation,
  );

  return fileName
    .replace(/%original_file_name%/g, path.basename(source))
    .replace(/%file_name%/g, path.basename(source, extName))
    .replace(/%file_extension%/g, extName.replace('.', ''))
    .replace(/%original_path%/g, path.dirname(source));
}

function getTranslations(
  language,
  allLanguages,
  availableLanguages,
  source,
  translation,
  mapping,
) {
  if (language) {
    return replaceLangVars(
      allLanguages,
      source,
      translation,
      language,
      mapping,
    );
  }
  return availableLanguages.reduce((acc, lang) => {
    acc[lang] = replaceLangVars(
      allLanguages,
      source,
      translation,
      lang,
      mapping,
    );
    return acc;
  }, {});
}

module.exports = async function getTranslationPaths(argv, language) {
  const branch = await getCrowdinBranch(argv);
  const API = getAPI(argv, branch);
  const availableLanguages = await API.availableLanguages();
  const allLanguages = await API.crowdinLanguages();

  const { files } = argv;

  const result = {};

  files.forEach(({ source, translation, languages_mapping: mapping }) => {
    const translations = getTranslations(
      language,
      allLanguages,
      availableLanguages,
      source,
      translation,
      mapping,
    );

    result[source] = translations;
  });
  return result;
};
