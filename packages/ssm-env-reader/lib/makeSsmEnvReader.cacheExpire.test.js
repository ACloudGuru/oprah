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

const makeSsmEnvReader = require('./makeSsmEnvReader');

const AWS = require('aws-sdk');

const handler = (event, context, callback) => ({ event, context, callback });
const cb = () => {};

describe('makeSsmEnvReader', () => {
    describe('when the cache has expired', () => {
        const ssm = new AWS.SSM();

        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR'
        };
        let result;

        beforeAll(() => {
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
                cacheDuration: 100000,
                getCurrentDate: jest.fn()
                    .mockImplementationOnce(() => '2018-05-28T01:59:08.523Z')
                    .mockImplementationOnce(() => '2099-05-28T01:59:08.523Z') // definitely expired
            });
            const lambdaHandler = ssmEnvReader(handler);
            const mockedContext = { existing: 'property' };

            // Simulate multiple calls
            return lambdaHandler({}, mockedContext, cb)
            .then(() => lambdaHandler({}, mockedContext, cb))
            .then(res => {
                result = res;
            });
        });

        it('should call ssm again when cache expires', () => {
            expect(ssm.getParameters.mock.calls.length).toEqual(2);
        });

        it('should inject the new ssm values', () => {
            expect(result).toEqual({
                event: {
                    ssm: {
                        FIRSTVAR: 'new 1st',
                        THIRDVAR: 'new 3rd'
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