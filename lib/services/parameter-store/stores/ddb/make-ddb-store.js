const { makeGetLatestVersion } = require('./make-get-latest-version');
const { makeGetAllParameters } = require('./make-get-all-parameters');

const makeDdbStore = ({ tableName }) => {
  const getLatestVersion = makeGetLatestVersion({ tableName });

  return {
    getAllParameters: makeGetAllParameters({
      getLatestVersion
    })
  };
}


module.exports = {
  makeDdbStore
};
