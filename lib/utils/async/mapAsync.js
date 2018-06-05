module.exports = async function mapAsync(items, cb) {
  return Promise.all(items.map(cb));
};
