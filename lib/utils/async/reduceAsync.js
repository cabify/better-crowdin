const mapAsync = require('./mapAsync');

module.exports = async function reduceAsync(items, asyncCb, syncCb, acc) {
  const resultItems = await mapAsync(items, asyncCb);

  let accResult = acc;

  resultItems.forEach((resultItem, index) => {
    accResult = syncCb(items[index], resultItem, accResult, index);
  });

  return accResult;
};
