const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

module.exports = {
  getSsmClient: () => ssm
};
