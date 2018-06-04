const mockProcess = require('../../utils/mockProcess');
const {
  mockConsole,
  unmockConsole,
  getLog,
} = require('../../utils/mockConsole');

const status = require('../../../lib/commands/status').handler;
const severalFiles = require('../../fixtures/config/severalFiles.json');

jest.mock('supports-color');
jest.mock('../../../lib/api');
jest.mock('../../../lib/utils/getCrowdinBranch');
jest.mock('../../../lib/utils/logCommand');

describe('commands/status', () => {
  const argv = {
    branch: undefined,
    skipValidation: [],
    ...severalFiles,
  };

  beforeEach(() => {
    mockProcess.mock();
    mockConsole();
  });

  afterEach(() => {
    mockProcess.unmock();
    unmockConsole();
  });

  describe('when everything is translated', () => {
    beforeEach(async () => {
      await status(argv);
    });

    it('should print properly the status', () => {
      expect(getLog()).toEqual([
        '- es-ES',
        '   - src/test/file1.json. 10 / 10',
        '   - src/test/file2.json. 5 / 5',
        '- pt-PT',
        '   - src/test/file1.json. 10 / 10',
        '   - src/test/file2.json. 5 / 5',
        '- pt-BR',
        '   - src/test/file1.json. 10 / 10',
        '   - src/test/file2.json. 5 / 5',
        'Everything fully translated. Enjoy!',
      ]);
    });

    it('should return 0 as exit', () => {
      expect(global.process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('when something is not translated', () => {
    beforeEach(async () => {
      await status({
        ...argv,
        branch: 'branch1',
      });
    });
    it('should print properly the status', () => {
      expect(getLog()).toEqual([
        '- es-ES',
        '   - src/test/file1.json. 1 / 1',
        '   - src/test/file2.json. 0 / 0',
        '- pt-PT',
        '   - src/test/file1.json. 0 / 1',
        '   - src/test/file2.json. 0 / 0',
        '- pt-BR',
        '   - src/test/file1.json. 1 / 1',
        '   - src/test/file2.json. 0 / 0',
        'Not fully translated, aborting',
      ]);
    });

    it('should return 1 as exit', () => {
      expect(global.process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('when there are languages with skip validation', () => {
    beforeEach(async () => {
      await status({
        ...argv,
        branch: 'branch1',
        skipValidation: ['pt-PT'],
      });
    });

    it('should include the skipped languages info in the console', () => {
      expect(getLog()).toEqual([
        '- es-ES',
        '   - src/test/file1.json. 1 / 1',
        '   - src/test/file2.json. 0 / 0',
        '- pt-BR',
        '   - src/test/file1.json. 1 / 1',
        '   - src/test/file2.json. 0 / 0',
        '',
        'Ignored languages:',
        '- pt-PT',
        '   - src/test/file1.json. 0 / 1',
        '   - src/test/file2.json. 0 / 0',
        'Everything fully translated. Enjoy!',
      ]);
    });

    it('should not affect to the exit code', () => {
      expect(global.process.exit).toHaveBeenCalledWith(0);
    });
  });
});
