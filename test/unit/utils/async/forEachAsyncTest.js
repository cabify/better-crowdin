const forEachAsync = require('../../../../lib/utils/async/forEachAsync');

describe('utils/async/forEachAsync', () => {
  it('should execute the foreach with async callbacks', async () => {
    const callback = jest.fn(
      () =>
        new Promise((resolve) => {
          resolve();
        }),
    );
    await forEachAsync([1, 2, 3], callback);
    expect(callback.mock.calls).toEqual([
      [1, 0, [1, 2, 3]],
      [2, 1, [1, 2, 3]],
      [3, 2, [1, 2, 3]],
    ]);
  });
});
