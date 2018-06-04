const getTranslationPaths = require('../../../lib/utils/getTranslationPaths');

const singleFile = require('../../fixtures/config/singleFile.json');
const severalFiles = require('../../fixtures/config/severalFiles.json');
const languagesMapping = require('../../fixtures/config/languagesMapping.json');

jest.mock('../../../lib/api');
jest.mock('../../../lib/utils/getCrowdinBranch');

describe('lib/getTranslationPaths', () => {
  describe('when working with a single source file', () => {
    describe('when asking for all languages', () => {
      it('should return all the language paths for that file', async () => {
        const result = await getTranslationPaths(singleFile);
        expect(result).toEqual({
          'src/test/file1.json': {
            'es-ES': 'src/test/es-ES/file1.json',
            'pt-BR': 'src/test/pt-BR/file1.json',
            'pt-PT': 'src/test/pt-PT/file1.json',
          },
        });
      });
    });

    describe('when askng for a single language', () => {
      it('should return only that language', async () => {
        const result = await getTranslationPaths(singleFile, 'pt-BR');
        expect(result).toEqual({
          'src/test/file1.json': 'src/test/pt-BR/file1.json',
        });
      });
    });
  });

  describe('when working with multiple source files', () => {
    describe('when asking for all languages', () => {
      it('should return all the language paths for all files', async () => {
        const result = await getTranslationPaths(severalFiles);
        expect(result).toEqual({
          'src/test/file1.json': {
            'es-ES': 'src/test/es-ES/file1.json',
            'pt-BR': 'src/test/pt-BR/file1.json',
            'pt-PT': 'src/test/pt-PT/file1.json',
          },
          'src/test/file2.json': {
            'es-ES': 'otherPath/es_ES/file2.json',
            'pt-BR': 'otherPath/pt_BR/file2.json',
            'pt-PT': 'otherPath/pt_PT/file2.json',
          },
        });
      });
    });

    describe('when asking for a single language', () => {
      it('should return only that language', async () => {
        const result = await getTranslationPaths(severalFiles, 'pt-BR');
        expect(result).toEqual({
          'src/test/file1.json': 'src/test/pt-BR/file1.json',
          'src/test/file2.json': 'otherPath/pt_BR/file2.json',
        });
      });
    });
  });

  describe('when having languageMappings', () => {
    describe('when asking for all languages', () => {
      it('should apply the mapping', async () => {
        const result = await getTranslationPaths(languagesMapping);
        expect(result).toEqual({
          'src/test/file1.json': {
            'es-ES': 'src/test/es.json',
            'pt-PT': 'src/test/pt.json',
            'pt-BR': 'src/test/pt-BR.json',
          },
        });
      });
    });

    describe('when asking for a single language', () => {
      it('should apply the mapping', async () => {
        const result = await getTranslationPaths(languagesMapping, 'es-ES');
        expect(result).toEqual({
          'src/test/file1.json': 'src/test/es.json',
        });
      });
    });
  });
});
