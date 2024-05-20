const AWS = require('aws-sdk');

const makeSsmClient = ({ region }) => {
  AWS.config.update({ region });
  return new AWS.SSM();
};

module.exports = {
  makeSsmClient
};
