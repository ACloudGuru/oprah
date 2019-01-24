const Bluebird = require('bluebird');
const _AWS = require('aws-sdk');

const DynamoDB = jest.fn(function () {});
DynamoDB.DocumentClient = jest.fn(function () {});
DynamoDB.Converter = _AWS.DynamoDB.Converter; // use actual implementation

const KMS = jest.fn(function () {});
const Lambda = jest.fn(function () {});
const SSM = jest.fn(function () {});
const SNS = jest.fn(function () {});
const Firehose = jest.fn(function () {});
const STS = jest.fn(function () {});
const MarketplaceEntitlementService = jest.fn(function () {});
const MarketplaceMetering = jest.fn(function () {});
const SQS = jest.fn(function () {});
const S3 = jest.fn(function () {});
const CloudFormation = jest.fn(function () {
  return ({
    describeStacks: jest.fn(() => ({
      promise: () => Bluebird.resolve()
    }))
  })
});

const AWS = {
  DynamoDB,
  KMS,
  Lambda,
  SSM,
  SNS,
  STS,
  SQS,
  S3,
  Firehose,
  MarketplaceEntitlementService,
  MarketplaceMetering,
  CloudFormation,
  config: {
    setPromisesDependency: () => {},
    update: () => {}
  }
};

module.exports = AWS;
