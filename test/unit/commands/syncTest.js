const mockProcess = require('../../utils/mockProcess');
const {
  mockConsole,
  unmockConsole,
  getLog,
} = require('../../utils/mockConsole');

const sync = require('../../../lib/commands/sync').handler;

jest.mock('../../../lib/commands/download');
jest.mock('../../../lib/commands/upload_cmds/sources');

describe('commands/sync', () => {
  beforeEach(async () => {
    mockProcess.mock();
    mockConsole();
    await sync({});
  });

  afterEach(() => {
    mockProcess.unmock();
    unmockConsole();
  });

  it('should upload & unload', () => {
    expect(getLog()).toEqual(['Sources uploaded', 'Translations downloaded']);
  });
});
