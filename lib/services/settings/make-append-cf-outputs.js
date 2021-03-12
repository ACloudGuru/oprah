const get = require('lodash.get');

const makeAppendCfOutputs = ({ cfService }) => settings => {
  const stackNames = get(settings, 'cfOutputs') || [];

  if (!stackNames.length) {
    return Promise.resolve(settings);
  }

  // add deprecation message

  return cfService
    .getOutputs({ stackNames })
    .then(outputs => ({ ...settings, outputs }));
};

module.exports = {
  makeAppendCfOutputs
};
