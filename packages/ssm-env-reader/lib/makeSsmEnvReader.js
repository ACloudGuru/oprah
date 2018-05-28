'use strict';

const AWS = require('aws-sdk');
const { invert, pickBy, startsWith, valuesIn } = require('lodash');

const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

const getSSMKeys = ({ env }) => {
    return pickBy(env, (value, key) => startsWith(key, 'SSM'))
};

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

const ssmEnvReader = handler => (event, context, callback) => {
    const envToPathMap = getSSMKeys({ env: process.env });

    const params = {
        Names: valuesIn(envToPathMap),
        WithDecryption: true
    };

    if (!params.Names.length) {
        return Promise.resolve()
        .then(() => handler(event, context, callback));
    }

    return ssm.getParameters(params).promise()
    .then(warnInvalidParameters)
    .then(ssmResponse => {
        const ssmValues = populateWithSSMValues({ envToPathMap, ssmResponse });
        const eventWithSSM = Object.assign({}, event, { ssm: ssmValues });
        return handler(eventWithSSM, context, callback);
    });
}

module.exports = {
    ssmEnvReader
};




