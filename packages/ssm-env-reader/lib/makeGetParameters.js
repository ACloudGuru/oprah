'use strict';

const Bluebird = require('bluebird');
const { chunk, get, last } = require('lodash');

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' }); // remove

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
    return Bluebird.reject(new Error(`Unable to fetch ${InvalidParameters}`))
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


module.exports = {
  makeGetParameters: (options) => {
    let getParametersPromise;
    return ({ paths }) => {
      if (getParametersPromise) {
        return getParametersPromise;
      }

      const chunkSize = get(options, 'chunkSize');

      getParametersPromise = chunkGetParameters({ chunkSize, paths })
        .tap(validateParameters)
        .then(generateParameterMap);

      return getParametersPromise
    };
  }
};
