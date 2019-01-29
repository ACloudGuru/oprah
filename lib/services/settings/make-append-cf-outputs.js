const Bluebird = require('bluebird');
const get = require('lodash.get');

const makeAppendCfOutputs =
  ({
    cfService
  }) =>
    settings => {
      const stackNames = get(settings, 'cfOutputs') || [];

      if (!stackNames.length) {
        return Bluebird.resolve(settings);
      }

      return cfService.getOutputs({ stackNames })
        .then(outputs => Object.assign({}, settings, { outputs }));
    };

module.exports = {
  makeAppendCfOutputs
};
