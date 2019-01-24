const entries = require('lodash.topairs');
const get =  require('lodash.get');
const { generateNextVersionNumber } = () => {};

const makeUpdateParameters =
({
  getLatestVersion,
  pushParameter
}) =>
  ({
    parameters,
    onComplete = () => Promise.resolve()
  }) => {

    return Promise.all(
      entries(parameters)
        .map(([key, value]) => {
          return getLatestVersion({ parameterName: key })
          .then(Item => {
            const currentVersionNumber = get(Item, 'version');
            const version = generateNextVersionNumber({ currentVersionNumber });
            const updatedItem = {
              name: key,
              value,
              version
            };

            return pushParameter({
              Item: updatedItem
            });
          })
          .then(onComplete);
        })
    );
  };

module.exports = {
  makeUpdateParameters
};
