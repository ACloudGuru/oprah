'use strict';

jest.mock('aws-sdk', () => {
    const getParameters = jest.fn();
    const SSM = jest.fn();

    SSM.mockImplementation(function() {
        this.getParameters = getParameters;
    });

    return {
        SSM
    };
});

const Bluebird = require('bluebird');
const makeSsmEnvReader = require('./makeSsmEnvReader');

const AWS = require('aws-sdk');

const handler = (event, context, callback) => ({ event, context, callback });
const cb = () => {};

describe('makeSsmEnvReader', () => {
    describe('when the cache is still valid', () => {
        let ssm;
        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR'
        };

        let result;

        beforeAll(() => {
            ssm = new AWS.SSM({});
            ssm.getParameters.mockReset();
            const promise = jest.fn()
            .mockImplementationOnce(() => Promise.resolve({
                Parameters: [
                    {
                        Name: '/path/to/FIRSTVAR',
                        Value: 'old 1st'
                    },
                    {
                        Name: '/path/to/THIRDVAR',
                        Value: 'old 3rd'
                    }
                ],
                InvalidParameters: [
                    '/path/to/SECONDVAR'
                ]
            }))
            .mockImplementationOnce(() => Promise.resolve({
                Parameters: [
                    {
                        Name: '/path/to/FIRSTVAR',
                        Value: 'new 1st'
                    },
                    {
                        Name: '/path/to/THIRDVAR',
                        Value: 'new 3rd'
                    }
                ],
                InvalidParameters: [
                    '/path/to/SECONDVAR'
                ]
            }));

            ssm.getParameters.mockImplementation(() => ({ promise }));

            const ssmEnvReader = makeSsmEnvReader({
                env,
                cacheDuration: 10000000000000000,
                getCurrentDate: () => '2018-05-28T01:59:08.523Z'
            });
            const lambdaHandler = ssmEnvReader(handler);
            const mockedContext = { existing: 'property' };

            // Simulate multiple calls
            return Bluebird.resolve()
            .then(() => lambdaHandler({}, mockedContext, cb))
            .then(() => lambdaHandler({}, mockedContext, cb))
            .then(() => lambdaHandler({}, mockedContext, cb))
            .delay(1000)
            .then(res => {
                result = res;
            });
        });

        it('should not call ssm more than once', () => {
            expect(ssm.getParameters.mock.calls.length).toEqual(1);
        });

        it('should inject the cached ssm values', () => {
            expect(result).toEqual({
                event: {
                    ssm: {
                        FIRSTVAR: 'old 1st',
                        THIRDVAR: 'old 3rd'
                    }
                },
                context: {
                    existing: 'property'
                },
                callback: cb
            });
        });
    });
});