const { getSsmClient } = require('./get-ssm-client');

const ssm = getSsmClient();

const getParametersByPathRecursively = async params => {
  const data = await ssm.getParametersByPath(params).promise();

  let parameters = data.Parameters || [];

  if (data.NextToken) {
    const nextParameters = await getParametersByPathRecursively({
      ...params,
      NextToken: data.NextToken
    });
    parameters = parameters.concat(nextParameters);
  }

  return parameters;
};

const getAllParametersByPath = async ({ path }) => {
  const allParameters = await getParametersByPathRecursively({
    Path: path,
    Recursive: true,
    WithDecryption: true
  });

  return allParameters;
};

module.exports = { getAllParametersByPath };
