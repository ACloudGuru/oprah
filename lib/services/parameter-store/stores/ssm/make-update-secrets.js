const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

function makeUpdateSecret({ key, value }) {
  const ssm = getSsmClient();
  const params = {
    Name: key,
    Type: 'SecureString',
    Value: value,
    Overwrite: true,
    KeyId: 'alias/aws/ssm'
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(() => ({ key, value }));
}

const makeUpdateSecrets =
() =>
  ({
    parameters,
    onComplete = () => Promise.resolve()
  }) => {
    const updaters = entries(parameters).map(([key, value]) => makeUpdateSecret({ key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
  };

module.exports = {
  makeUpdateSecrets
};