const mockProcess = require('../../../utils/mockProcess');
const {
  mockConsole,
  unmockConsole,
  getLog,
} = require('../../../utils/mockConsole');

const lsBranches = require('../../../../lib/commands/branches_cmds/all')
  .handler;

jest.mock('supports-color');
jest.mock('../../../../lib/api');
jest.mock('../../../../lib/utils/getCrowdinBranch');
jest.mock('../../../../lib/utils/logCommand');

describe('commands/branches/all', () => {
  beforeEach(async () => {
    mockProcess.mock();
    mockConsole();
    await lsBranches({});
  });

  afterEach(() => {
    mockProcess.unmock();
    unmockConsole();
  });

  it('should return all the branches', () => {
    expect(getLog()).toEqual([' - branch1', ' - branch2']);
  });
});
