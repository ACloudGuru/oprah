const get = require('lodash.get');
const { makeDdbClient } = require('./make-ddb-client');

const makeGetAllParameters =
({ tableName }) =>
  ({ parameterNames }) => {
    const getParameter = parameterName => {
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
      })
    }

    const accumulateParameters = parameters => parameters.reduce((acc, parameterObject) => {
      const parameterPath = get(parameterObject, 'Name') || '';
      const key = parameterPath.split('/').pop();

      if (!key) {
        return acc;
      }

      return Object.assign({}, acc, { [key]: get(parameterObject, 'Value') });
    }, {});

    return Promise.all(parameterNames.map(parameterName => {
      return getParameter(parameterName)
      .then(Value => ({
        Name: parameterName,
        Value
      }))
    }))
    .then(accumulateParameters);
  }

module.exports = {
  makeGetAllParameters
};
