const chunk = require('lodash/chunk');

const makeDeleteParameters = ({ ssm }) => ({ parameterNames }) => {
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

module.exports = { makeDeleteParameters };
