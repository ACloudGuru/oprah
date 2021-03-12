const get = require('lodash.get');
const Bluebird = require('bluebird');
const { generateNextVersionNumber } = require('./generate-next-version-number');

const makeUpdateParameters = ({ getLatestVersion, pushParameter }) => ({
  parameters,
  onComplete = () => Bluebird.resolve()
}) =>
  Bluebird.all(
    Object.entries(parameters).map(([key, value]) =>
      getLatestVersion({ parameterName: key }).then(Item => {
        const currentVersionNumber = get(Item, 'version');
        const currentValue = get(Item, 'value');

        if (value === currentValue) {
          return Bluebird.resolve();
        }

        const version = generateNextVersionNumber({ currentVersionNumber });
        const updatedItem = {
          name: key,
          value,
          version
        };

        return pushParameter({
          name: get(updatedItem, 'name'),
          value: get(updatedItem, 'value'),
          version: get(updatedItem, 'version')
        }).then(onComplete);
      })
    )
  );

module.exports = {
  makeUpdateParameters
};
