const jq = require('json-query');

function getFileQuery(sourcePath, branch) {
  const parts = sourcePath.split('/');
  let query = parts.map((part) => `files[name=${part}]`).join('.');

  if (branch) {
    query = `files[node_type=branch&name=${branch}].${query}`;
  }
  return query;
}

module.exports = function getFile(filePath, branch, crowdinData) {
  return jq(getFileQuery(filePath, branch), {
    data: crowdinData,
  }).value;
};
