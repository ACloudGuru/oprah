const { makeDdbClient } = require('./make-ddb-client');
const get = require('lodash.get');

const makePushParameter =
({ tableName }) =>
  ({ Item }) => {
    const ddb = makeDdbClient({ tableName });
    return ddb.put({
      Item,
      ConditionExpression: 'attribute_not_exists(#name)',
      TableName: tableName,
      ExpressionAttributeNames: {
        '#name': 'name',
      }
    })
    .promise()
    .then(() => ({
      key: get(Item, 'name'),
      value: get(Item, 'value')
    }));
  };

module.exports = {
  makePushParameter
};
