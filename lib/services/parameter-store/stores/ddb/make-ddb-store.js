const { makeGetLatestVersion } = require('./make-get-latest-version');
const { makeGetAllParameters } = require('./make-get-all-parameters');
const { makeUpdateParameters } = require('./make-update-parameters');
const { makePushParameter } = require('./make-push-parameter');

const makeDdbStore = ({ tableName }) => {
  const getLatestVersion = makeGetLatestVersion({ tableName });
  const pushParameter = makePushParameter({ tableName });

  const updateParameters = makeUpdateParameters({
    getLatestVersion,
    pushParameter
  });

  return {
    getAllParameters: makeGetAllParameters({
      getLatestVersion
    }),
    updateConfigs: updateParameters,
    updateSecrets: updateParameters
  };
}


module.exports = {
  makeDdbStore
};
