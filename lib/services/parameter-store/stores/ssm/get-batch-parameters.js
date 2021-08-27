const get = require('lodash/get');
const { getSsmClient } = require('./get-ssm-client');

const getParametersFromSSM = ({ parameterNames }) => {
  const ssm = getSsmClient();

  return ssm
    .getParameters({
      Names: parameterNames,
      WithDecryption: true
    })
    .promise()
    .then(res => {
      const validParameters = get(res, 'Parameters') || [];
      const invalidParameters = get(res, 'InvalidParameters') || [];
      const normalizedInvalidParameters = invalidParameters.map(name => ({
        Name: name
      }));
      const allParameters = [].concat(
        validParameters,
        normalizedInvalidParameters
      );

      return parameterNames.reduce((acc, name) => {
        const matchingParameter = allParameters.find(
          parameter => get(parameter, 'Name') === name
        );
        const value = get(matchingParameter, 'Value') || '';
        return acc.concat(value);
      }, []);
    });
};

const getBatchParameters = ({ parameterNames }) => {
  const size = 10;
  const chunks = [
    ...Array(Math.ceil(parameterNames.length / size))
  ].map((_, i) => parameterNames.slice(i * size, i * size + size));

  const chunksOfRequests = chunks.map(chunkOfTen => () =>
    getParametersFromSSM({ parameterNames: chunkOfTen })
  );

  return Promise.all(chunksOfRequests.map(request => request())).then(res =>
    res.flat()
  );
};

module.exports = {
  getBatchParameters
};
