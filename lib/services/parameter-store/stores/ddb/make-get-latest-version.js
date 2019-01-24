const get = require('lodash.get');
const { makeDdbClient } = require('./make-ddb-client');

const makeGetLatestVersion =
  ({ tableName }) =>
    ({ parameterName }) => {
      const ddb = makeDdbClient({ tableName });
      return ddb.query({
        Limit: 1,
        ConsistentRead: true,
        ScanIndexForward: false,
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': parameterName
        }
      })
      .promise()
      .then(res => get(res, 'Items.0.value') || null)
      .catch(e => {
        console.log(e);
        return null;
      });
  };

module.exports = {
  makeGetLatestVersion
};
