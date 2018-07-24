'use strict';

const Bluebird = require('bluebird');
const { chunk, get, last } = require('lodash');
const { addMilliseconds, isAfter } = require('date-fns');

const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

const chunkGetParameters = ({ chunkSize = 10, paths = [] }) => {
  if (!paths.length) {
    return Bluebird.resolve({});
  }

  if (chunkSize > 10) {
    return Bluebird.reject(new Error('You cannot have a chunkSize greater than 10'));
  }

  const chunks = chunk(paths, chunkSize);
  return Bluebird.all(
    chunks.map(Names => ssm.getParameters({
      Names,
      WithDecryption: true
    }).promise())
  )
  .then(res => res.reduce(
    (acc, { Parameters, InvalidParameters }) => {
      return {
        Parameters: acc.Parameters.concat(Parameters),
        InvalidParameters: acc.InvalidParameters.concat(InvalidParameters)
      }
    },
    {
      Parameters: [],
      InvalidParameters: []
    }
  ));
}

const validateParameters = ({ InvalidParameters }) => {
  if (InvalidParameters.length) {
    const error = new Error(`Unable to fetch ${InvalidParameters}`);
    console.error(error);
    return Bluebird.reject(error);
  }
};

const generateParameterMap = ({ Parameters }) => {
  return Parameters.reduce(
    (acc, parameter) => {
      const Name = get(parameter, 'Name') || ''
      const key = last(Name.split('/'))
      return Object.assign(
        {},
        acc,
        {
          [key]: get(parameter, 'Value')
        }
      );
    },
    {}
  );
}

const getParameters = ({ chunkSize, paths }) => chunkGetParameters({ chunkSize, paths })
  .tap(validateParameters)
  .then(generateParameterMap);

module.exports = {
  makeGetParameters: (options) => {
    let getParametersPromise;
    const chunkSize = get(options, 'chunkSize');

    return ({ paths }) => {
      if (!getParametersPromise) {
        getParametersPromise = getParameters({
          chunkSize,
          paths
        });
      }

      return getParametersPromise;
    };
  }
};
