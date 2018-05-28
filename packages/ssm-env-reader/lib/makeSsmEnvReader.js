'use strict';

const AWS = require('aws-sdk');
const { invert, pickBy, startsWith, valuesIn, chunk } = require('lodash');

const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

const populateWithSSMValues = ({ envToPathMap, ssmResponse }) => {
    const pathToEnvMap = invert(envToPathMap);
    const parameters = ssmResponse.Parameters || [];
    return parameters.reduce((acc, { Name,  Value }) => {
        if (!Name) {
            return acc;
        }

        const envVariableName = pathToEnvMap[Name];

        // Removes SSM_
        const sanitizedVariableName = envVariableName.split('_').slice(1).join('_');
        return Object.assign({}, acc, { [sanitizedVariableName]: Value });
    }, {})
}

const warnInvalidParameters = ssmResponse => {
    const invalidParameters = ssmResponse.InvalidParameters || [];
    invalidParameters.forEach(key => {
        console.error(`Unable to retreive: ${key}`)
    });

    return ssmResponse;
}

const getAllParameters = ({ envToPathMap }) => {
    const parameters = valuesIn(envToPathMap);

    if (!parameters.length) {
        return Promise.resolve({});
    }

    const chunks = chunk(parameters, 10);
    return Promise.all(
        chunks.map(Names => getParameters({ envToPathMap, Names }))
    )
    .then(responses => responses.reduce((acc, value) => Object.assign({}, acc, value), {}));
}

const getParameters = ({ envToPathMap, Names }) => {
    const params = {
        Names,
        WithDecryption: true
    };

    return ssm.getParameters(params).promise()
    .then(warnInvalidParameters)
    .then(ssmResponse => populateWithSSMValues({ envToPathMap, ssmResponse }))
}

const makeSsmEnvReader = ({ env }) => handler => (event, context, callback) => {
    const envToPathMap = pickBy(env, (value, key) => startsWith(key, 'SSM'))

    return getAllParameters({ envToPathMap })
    .then(ssmValues => {
        const eventWithSSM = Object.assign({}, event, { ssm: ssmValues });
        return handler(eventWithSSM, context, callback);
    });
}

module.exports = makeSsmEnvReader;
