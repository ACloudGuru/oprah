const { makeGetAllParameters } = require('./make-get-all-parameters');

const makeDdbStore = ({ tableName }) => {
  return {
    getAllParameters: makeGetAllParameters({
      tableName
    })
  };
}


module.exports = {
  makeDdbStore
};
