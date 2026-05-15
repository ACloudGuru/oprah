const AWS = require('aws-sdk');
const { getRegion } = require('../../../settings/get-region');

const secretsmanager = new AWS.SecretsManager({ region: getRegion() });

module.exports = {
  getSecretsManagerClient: () => secretsmanager
};
