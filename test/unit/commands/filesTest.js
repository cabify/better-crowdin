const mockProcess = require('../../utils/mockProcess');
const severalFiles = require('../../fixtures/config/severalFiles.json');

const {
  mockConsole,
  unmockConsole,
  getLog,
} = require('../../utils/mockConsole');

const lsFiles = require('../../../lib/commands/files').handler;

jest.mock('supports-color');
jest.mock('../../../lib/api');
jest.mock('../../../lib/utils/getCrowdinBranch');
jest.mock('../../../lib/utils/logCommand');

describe('commands/ls/files', () => {
  beforeEach(async () => {
    mockProcess.mock();
    mockConsole();
    await lsFiles(severalFiles);
  });

  afterEach(() => {
    mockProcess.unmock();
    unmockConsole();
  });

  it('should return all the files', () => {
    expect(getLog()).toEqual([
      ' - src/test/file1.json',
      '   - es-ES src/test/es-ES/file1.json',
      '   - pt-PT src/test/pt-PT/file1.json',
      '   - pt-BR src/test/pt-BR/file1.json',
      ' - src/test/file2.json',
      '   - es-ES otherPath/es_ES/file2.json',
      '   - pt-PT otherPath/pt_PT/file2.json',
      '   - pt-BR otherPath/pt_BR/file2.json',
    ]);
  });
});
