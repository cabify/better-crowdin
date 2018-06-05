const path = require('path');

module.exports = function getBasePath({ config, basePath, relativePath }) {
  if (relativePath) {
    return path.join(path.dirname(config), basePath);
  }
  return basePath;
};
