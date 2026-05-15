const AWS = require('aws-sdk');
const { getRegion } = require('../../../settings/get-region');

const ssm = new AWS.SSM({ region: getRegion() });

module.exports = {
  getSsmClient: () => ssm
};
