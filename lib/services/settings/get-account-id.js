const AWS = require('aws-sdk');
const get = require('lodash.get');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const sts = new AWS.STS();

const getAccountId = () => sts.getCallerIdentity({})
  .promise()
  .then(res => {
    const accountId = get(res, 'Account');
    if (!accountId) {
      throw new Error('Missing accountId');
    }

    return accountId;
  })
  .catch(err => {
    console.error(err);
    throw new Error('Could not get accountId');
  });

module.exports = {
  getAccountId
};

