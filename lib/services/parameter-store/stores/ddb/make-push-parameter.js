const { makeDdbClient } = require('./make-ddb-client');

const makePushParameter =
({ tableName }) =>
  ({
    name,
    value,
    version
  }) => {
    const ddb = makeDdbClient({ tableName });
    return ddb.put({
      Item: {
        name,
        value,
        version
      },
      ConditionExpression: 'attribute_not_exists(#name)',
      ExpressionAttributeNames: {
        '#name': 'name',
      }
    })
    .promise()
    .then(() => ({
      name,
      value,
      version
    }))
    .catch(() => {
      throw new Error(`Unable to update ${JSON.stringify({ name, value, version }, null, 2)}`);
    });
  };

module.exports = {
  makePushParameter
};
