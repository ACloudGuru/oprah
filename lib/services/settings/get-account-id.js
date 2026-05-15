const AWS = require('aws-sdk');
const get = require('lodash/get');
const { getRegion } = require('./get-region');

const sts = new AWS.STS({ region: getRegion() });

const getAccountId = () =>
  sts
    .getCallerIdentity({})
    .promise()
    .then(res => {
      const accountId = get(res, 'Account');
      if (!accountId) {
        throw new Error('Missing accountId');
      }

      return accountId;
    })
    .catch(error => {
      throw new Error(error.message);
    });

module.exports = {
  getAccountId
};
