'use strict';

const Bluebird = require('bluebird');
const { getSsmClient } = require('./get-ssm-client');
const get = require('lodash.get');
const chunk = require('lodash.chunk');
const flatten = require('lodash.flatten');

const getParametersFromSSM = ({ parameterNames }) => {
  const ssm = getSsmClient();

  return ssm.getParameters({
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
    const allParameters = [].concat(validParameters, normalizedInvalidParameters);

    return parameterNames.reduce((acc, name) => {
      const matchingParameter = allParameters.find(parameter => get(parameter, 'Name') === name);
      const value = get(matchingParameter, 'Value') || '';
      return acc.concat(value);
    }, [])
  });
}

const getBatchParameters = ({ parameterNames }) => {
  const chunks = chunk(parameterNames, 10);
  const chunksOfRequests = chunks.map(chunkOfTen => () => getParametersFromSSM({ parameterNames: chunkOfTen }));

  return Bluebird.mapSeries(chunksOfRequests, request => request())
    .then(flatten)
}

module.exports = {
  getBatchParameters
};
