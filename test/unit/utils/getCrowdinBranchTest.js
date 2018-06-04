const getCrowdinBranch = require('../../../lib/utils/getCrowdinBranch');

jest.mock('git-branch');

describe('getCrowdinBranch', () => {
  const argv = {
    baseBranches: ['master'],
    basePath: 'test/folder',
  };

  describe('when explicitly set branch via args', () => {
    describe('when is one of the base branches', () => {
      it('should return undefined', async () => {
        expect(
          await getCrowdinBranch({
            ...argv,
            branch: 'master',
          }),
        ).toBeUndefined();
      });
    });

    describe('when is a custom branch', () => {
      it('should return it translated', async () => {
        expect(
          await getCrowdinBranch({
            ...argv,
            branch: 'some/other-branch',
          }),
        ).toEqual('some_other-branch');
      });
    });
  });

  describe('when reading the branch from git', () => {
    describe('when is one of the base branches', () => {
      it('should return undefined', async () => {
        expect(
          await getCrowdinBranch({
            basePath: 'test/folder',
            baseBranches: ['my/test-branch'],
          }),
        ).toBeUndefined();
      });
    });

    describe('when is a custom branch', () => {
      it('should return it translated', async () => {
        expect(await getCrowdinBranch(argv)).toEqual('my_test-branch');
      });
    });
  });
});
