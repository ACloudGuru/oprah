'use strict';

const Bluebird = require('bluebird');
const { getSsmClient } = require('./get-ssm-client');
const get = require('lodash.get');
const chunk = require('lodash.chunk');
const flatten = require('lodash.flatten');

const getTenParameters = ({ parameterNames }) => {
  const ssm = getSsmClient();

  return ssm.getParameters({
    Names: parameterNames,
    WithDecryption: true
  })
  .promise()
  .then(res => get(res, 'Parameters'))
  .then(parameters => parameters.map(parameter => get(parameter, 'Value')))
}

const getBatchParameters = ({ parameterNames }) => {
  const chunks = chunk(parameterNames, 10);
  const chunksOfRequests = chunks.map(chunkOfTen => () => getTenParameters({ parameterNames: chunkOfTen }));

  return Bluebird.mapSeries(chunksOfRequests, request => request())
    .then(flatten)
}

module.exports = {
  getBatchParameters
};
