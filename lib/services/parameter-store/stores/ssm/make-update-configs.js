const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

function makeUpdateConfig({ path, key, value }) {
  const ssm = getSsmClient();
  const Name = `${path}/${key}`;
  const params = {
    Name,
    Type: 'String',
    Value: value,
    Overwrite: true
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(() => ({ key, value }));
}

const makeUpdateConfigs =
() =>
  ({
    configs,
    path,
    onComplete = () => Promise.resolve()
  }) => {
    const updaters = entries(configs).map(([key, value]) => makeUpdateConfig({ path, key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
  };

module.exports = {
  makeUpdateConfigs
};
