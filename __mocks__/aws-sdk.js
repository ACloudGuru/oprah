const Bluebird = require('bluebird');

const S3 = jest.fn();
const SecretsManager = jest.fn();
const DynamoDB = {
  DocumentClient: jest.fn().mockReturnValue({
    put: jest.fn({ promise: () => Promise.resolve({}) }),
    query: jest.fn({ promise: () => Promise.resolve({ Items: [] }) }),
    update: jest.fn({ promise: () => Promise.resolve({}) }),
    delete: jest.fn({ promise: () => Promise.resolve({}) }),
    get: jest.fn({ promise: () => Promise.resolve({ Item: {} }) }),
    options: {
      convertEmptyValues: true
    }
  })
};

const CloudFormation = jest.fn(() => ({
  describeStacks: jest.fn(() => ({
    promise: () => Bluebird.resolve()
  }))
}));
const KMS = jest.fn(() => {});
const SSM = jest.fn(() => {});
const SNS = jest.fn(() => {});
const STS = jest.fn(() => ({
  getCallerIdentity: () => ({
    promise: () =>
      Bluebird.resolve({
        Account: '1234'
      })
  })
}));

const config = {
  setPromisesDependency: jest.fn(),
  update: jest.fn()
};

module.exports = {
  config,
  CloudFormation,
  DynamoDB,
  SecretsManager,
  STS,
  KMS,
  SNS,
  SSM,
  S3
};
