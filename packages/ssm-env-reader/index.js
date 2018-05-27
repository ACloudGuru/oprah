import * as AWS from 'aws-sdk';
import { Handler, Context, Callback } from 'aws-lambda';
import { invert, pickBy, startsWith, valuesIn } from 'lodash';

const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

type SSMEnvToPathMap = {
    [key: string]: any
}

type SSMPathToEnvMap = {
    [key: string]: any
}

type SSMValues = {
    [key: string]: any
}

type LambdaHandler = (event: any, context: Context, callback: Callback) => void

const getSSMKeys = (): SSMEnvToPathMap => {
    return pickBy(process.env, (value, key) => {
        return startsWith(key, 'SSM');
    })
};

const populateWithSSMValues = (pathToEnvMap: SSMPathToEnvMap, ssmResponse: AWS.SSM.GetParametersResult) => {
    const parameters = ssmResponse.Parameters || [];
    return parameters.reduce((acc: SSMValues, { Name,  Value }) => {
        if (!Name) {
            return acc;
        }

        const envVariableName = pathToEnvMap[Name];

        // Removes SSM_
        const sanitizedVariableName = envVariableName.split('_').slice(1).join('_');
        return Object.assign({}, acc, { [sanitizedVariableName]: Value });
    }, {})
}

const warnInvalidParameters = (ssmResponse: AWS.SSM.GetParametersResult) => {
    const invalidParameters = ssmResponse.InvalidParameters || [];
    invalidParameters.forEach(key => {
        console.error(`Unable to retreive: ${key}`)
    });
}

const ssmEnvReader = (handler: LambdaHandler) => async (event: any, context: Context, callback: Callback) => {
    const envToPathMap = getSSMKeys();
    const pathToEnvMap = invert(envToPathMap);

    const params = {
        Names: valuesIn(envToPathMap),
        WithDecryption: true
    };

    if (!params.Names.length) {
        return handler(event, context, callback);
    }

    const ssmResponse = await ssm.getParameters(params).promise();
    warnInvalidParameters(ssmResponse);
    const ssmValues = populateWithSSMValues(pathToEnvMap, ssmResponse);
    const eventWithSSM = Object.assign({}, event, { ssm: ssmValues });
    return handler(eventWithSSM, context, callback);
}

export default ssmEnvReader;
export { ssmEnvReader };




