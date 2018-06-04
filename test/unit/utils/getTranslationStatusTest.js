const getTranslationStatus = require('../../../lib/utils/getTranslationStatus');

const severalFiles = require('../../fixtures/config/severalFiles.json');

jest.mock('../../../lib/api');

describe('lib/getTranslationStatus', () => {
  describe('when asking by a single branch', () => {
    describe('when asking about the main branch', () => {
      it('should return info of that branch', async () => {
        expect(await getTranslationStatus(severalFiles, null)).toEqual({
          'es-ES': {
            'src/test/file1.json': {
              phrases: 10,
              translated: 10,
            },
            'src/test/file2.json': {
              phrases: 5,
              translated: 5,
            },
          },
          'pt-BR': {
            'src/test/file1.json': {
              phrases: 10,
              translated: 10,
            },
            'src/test/file2.json': {
              phrases: 5,
              translated: 5,
            },
          },
          'pt-PT': {
            'src/test/file1.json': {
              phrases: 10,
              translated: 10,
            },
            'src/test/file2.json': {
              phrases: 5,
              translated: 5,
            },
          },
        });
      });
    });
    describe('when asking about specific branch', () => {
      it('should return info of that branch', async () => {
        expect(await getTranslationStatus(severalFiles, 'branch1')).toEqual({
          'es-ES': {
            'src/test/file1.json': {
              phrases: 1,
              translated: 1,
            },
            'src/test/file2.json': {
              phrases: 0,
              translated: 0,
            },
          },
          'pt-BR': {
            'src/test/file1.json': {
              phrases: 1,
              translated: 1,
            },
            'src/test/file2.json': {
              phrases: 0,
              translated: 0,
            },
          },
          'pt-PT': {
            'src/test/file1.json': {
              phrases: 1,
              translated: 0,
            },
            'src/test/file2.json': {
              phrases: 0,
              translated: 0,
            },
          },
        });
      });
    });
  });
});
