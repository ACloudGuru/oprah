const cfn = require('cfn');

const deploy = ({
  name,
  params,
  template,
}) => {
  return cfn({
    name,
    template,
    cfParams: params,
    awsConfig: {
      region: 'us-east-1'
    },
    checkStackInterval: 5000
  });
}

module.exports = {
  deploy
};
