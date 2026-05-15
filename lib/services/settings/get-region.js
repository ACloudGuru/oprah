const getRegion = () =>
  process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

module.exports = {
  getRegion
};
