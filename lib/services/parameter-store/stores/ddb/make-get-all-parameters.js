const Bluebird = require('bluebird');

const makeGetAllParameters =
({ tableName }) =>
  ({ parameterNames }) => {
    return Bluebird.resolve({
      'config1': 'value1'
    });
  }

module.exports = {
  makeGetAllParameters
};
