const { makeDdbClient } = require('./make-ddb-client');
const get = require('lodash.get');

const makePushParameter =
({ tableName }) =>
  ({ Item }) => {
    const ddb = makeDdbClient({ tableName });
    return ddb.put({
      Item,
      ConditionExpression: 'attribute_not_exists(#name)',
      ExpressionAttributeNames: {
        '#name': 'name',
      }
    })
    .promise()
    .then(() => ({
      key: get(Item, 'name'),
      value: get(Item, 'value')
    }))
    .catch(() => {
      throw new Error(`Unable to update ${JSON.stringify(Item, null, 2)}`);
    });
  };

module.exports = {
  makePushParameter
};
