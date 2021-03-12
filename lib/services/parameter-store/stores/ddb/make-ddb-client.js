const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const makeDdbClient = ({ tableName }) =>
  new AWS.DynamoDB.DocumentClient({
    params: {
      TableName: tableName
    },
    convertEmptyValues: true
  });

module.exports = {
  makeDdbClient
};
