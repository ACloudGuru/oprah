'use strict';

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const ssm = new AWS.SSM();

module.exports = {
  getSsmClient: () => ssm
};
