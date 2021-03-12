const { getOutputs } = require('./get-outputs');
const { deploy } = require('./deploy');

const makeCfService = () => ({
  deploy,
  getOutputs
});

module.exports = {
  makeCfService
};
