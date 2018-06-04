const mapAsync = require('../../../../lib/utils/async/mapAsync');

async function incAsync(number) {
  return new Promise((resolve) => {
    resolve(number + 1);
  });
}

describe('utils/async/mapAsync', () => {
  it('should return all values when all promises are resolved', async () => {
    const result = await mapAsync([1, 2, 3], incAsync);
    expect(result).toEqual([2, 3, 4]);
  });
});
