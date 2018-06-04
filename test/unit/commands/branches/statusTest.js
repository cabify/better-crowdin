const mockProcess = require('../../../utils/mockProcess');
const {
  mockConsole,
  unmockConsole,
  getLog,
} = require('../../../utils/mockConsole');

const severalFiles = require('../../../fixtures/config/severalFiles.json');

const status = require('../../../../lib/commands/branches_cmds/status').handler;

jest.mock('supports-color');
jest.mock('../../../../lib/api');
jest.mock('../../../../lib/utils/getCrowdinBranch');
jest.mock('../../../../lib/utils/logCommand');

describe('commands/branches/status', () => {
  beforeEach(() => {
    mockProcess.mock();
    mockConsole();
  });

  afterEach(() => {
    mockProcess.unmock();
    unmockConsole();
  });

  describe('with no options', () => {
    beforeEach(async () => {
      await status({
        ...severalFiles,
        skipValidation: [],
      });
    });

    it('should return all the branches with their status', () => {
      expect(getLog()).toEqual([
        ' - branch1 NOT TRANSLATED',
        ' - branch2 TRANSLATED',
      ]);
    });
  });

  describe('when skipping validation of some languages', () => {
    beforeEach(async () => {
      await status({
        ...severalFiles,
        skipValidation: ['pt-PT'],
      });
    });
    it('should not include those languages in result', () => {
      expect(getLog()).toEqual([
        ' - branch1 TRANSLATED',
        ' - branch2 TRANSLATED',
      ]);
    });
  });

  describe('with translated-only', () => {
    beforeEach(async () => {
      await status({
        ...severalFiles,
        translatedOnly: true,
        skipValidation: [],
      });
    });

    it('should only return the translated branches', () => {
      expect(getLog()).toEqual(['branch2']);
    });
  });
});
