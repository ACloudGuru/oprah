const get = require('lodash.get');

const makeFetch = ({ parameterStore, settingsService }) => ({ keys }) =>
  settingsService
    .getSettings()
    .then(settings => [
      ...get(settings, 'configParameters'),
      ...get(settings, 'secretParameters')
    ])
    .then(parametersFromSetting =>
      keys
        .map(key =>
          parametersFromSetting.find(param => param.split('/').pop() === key)
        )
        .filter(Boolean)
    )
    .then(parameterNames =>
      parameterStore.getParameters({
        parameterNames
      })
    )
    /* eslint-disable-next-line */
    .then(output => console.log(JSON.stringify(output, null, 2)));

module.exports = {
  makeFetch
};
