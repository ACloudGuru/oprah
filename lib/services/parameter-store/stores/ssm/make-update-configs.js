const get = require('lodash.get');
const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

function makeUpdateConfig({ key, value }) {
  const ssm = getSsmClient();
  const params = {
    Name: key,
    Type: 'String',
    Value: value,
    Overwrite: true
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(res => ({
      name: key,
      value,
      version: get(res, 'Version')
    }));
}

const makeUpdateConfigs =
() =>
  ({
    parameters,
    onComplete = () => Promise.resolve()
  }) => {
    const updaters = entries(parameters).map(([key, value]) => makeUpdateConfig({ key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
  };

module.exports = {
  makeUpdateConfigs
};
