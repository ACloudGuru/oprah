const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const makeDdbClient = ({ tableName }) => {
  return new AWS.DynamoDB.DocumentClient({
    params: {
      TableName: tableName
    },
    convertEmptyValues: true
  });
};

module.exports = {
  makeDdbClient
};
