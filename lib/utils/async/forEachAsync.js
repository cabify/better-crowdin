const mapAsync = require('./mapAsync');

module.exports = async function forEachAsync(items, cb) {
  await mapAsync(items, cb);
};
