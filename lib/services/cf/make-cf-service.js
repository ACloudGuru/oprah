const { getOutputs } = require('./get-outputs');
const { deploy } = require('./deploy');

const makeCfService = () => {
  return {
    deploy,
    getOutputs
  };
};

module.exports = {
  makeCfService
};
