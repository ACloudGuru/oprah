const Bluebird = require('bluebird');

const getAllParameters = ({ path, tableName }) => {
  return Bluebird.resolve({
    'config1': 'value1'
  });
}


module.exports = {
  getAllParameters
};
