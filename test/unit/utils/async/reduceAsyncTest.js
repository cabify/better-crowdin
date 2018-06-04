const reduceAsync = require('../../../../lib/utils/async/reduceAsync');

async function incAsync(number) {
  return new Promise((resolve) => {
    resolve(number + 1);
  });
}

describe('utils/async/mapAsync', () => {
  it('should traverse through the array firts with the asyncFunction and then reduce with sync array', async () => {
    const result = await reduceAsync(
      [1, 2, 3],
      incAsync,
      (originalItem, item, acc) => acc + item,
      0,
    );
    expect(result).toEqual(9);
  });
});
