const chunk = require('lodash/chunk');
const { getSsmClient } = require('./get-ssm-client');

const deleteParameters = ({ parameterNames }) => {
  const ssm = getSsmClient();

  const chunks = chunk(parameterNames, 10);
  const promises = chunks.map(chunkedParameterNames =>
    ssm
      .deleteParameters({
        Names: chunkedParameterNames
      })
      .promise()
  );
  return Promise.all(promises);
};

module.exports = { deleteParameters };
