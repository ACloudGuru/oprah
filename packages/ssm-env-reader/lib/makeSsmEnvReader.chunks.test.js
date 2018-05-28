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

const { valuesIn, take } = require('lodash');
const makeSsmEnvReader = require('./makeSsmEnvReader');

const AWS = require('aws-sdk');

const handler = (event, context, callback) => ({ event, context, callback });
const cb = () => {};

describe('makeSsmEnvReader', () => {
    describe('when the number of parameters exceed 10', () => {
        let ssm;
        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR',
            SSM_FOURTHVAR: '/path/to/FOURTHVAR',
            SSM_FIFTHVAR: '/path/to/FIFTHVAR',
            SSM_SIXTHVAR: '/path/to/SIXTHVAR',
            SSM_SEVENTHVAR: '/path/to/SEVENTHVAR',
            SSM_EIGTHVAR: '/path/to/EIGTHVAR',
            SSM_NINTHVAR: '/path/to/NINTHVAR',
            SSM_TENTHVAR: '/path/to/TENTHVAR',
            SSM_ELEVENTHVAR: '/path/to/ELEVENTHVAR',
            SSM_TWELFTHVAR: '/path/to/TWELFTHVAR',
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
                        Value: '1st'
                    },
                    {
                        Name: '/path/to/THIRDVAR',
                        Value: '3rd'
                    },
                    {
                        Name: '/path/to/SIXTHVAR',
                        Value: '6th'
                    }
                ],
                InvalidParameters: [
                    '/path/to/FOURTHVAR',
                    '/path/to/FIFTHVAR',
                    '/path/to/SECONDVAR',
                    '/path/to/SEVENTHVAR',
                    '/path/to/EIGTHVAR',
                    '/path/to/NINTHVAR',
                    '/path/to/TENTHVAR',
                ]
            }))
            .mockImplementationOnce(() => Promise.resolve({
                Parameters: [
                    {
                        Name: '/path/to/ELEVENTHVAR',
                        Value: '11th'
                    },
                    {
                        Name: '/path/to/TWELFTHVAR',
                        Value: '12th'
                    }
                ],
                InvalidParameters: []
            }));

            ssm.getParameters.mockImplementation(() => ({ promise }))

            const ssmEnvReader = makeSsmEnvReader({
                env,
                cacheDuration: 10000000000000000,
                getCurrentDate: () => '2018-05-28T01:59:08.523Z'
            })
            const lambdaHandler = ssmEnvReader(handler);
            const mockedContext = { existing: 'property' };

            return lambdaHandler({}, mockedContext, cb)
            .then(res => {
                result = res;
            });
        });

        it('sends getParameters in chunks of 10 when the requested parameter list exceeds 10', () => {
            expect(ssm.getParameters.mock.calls[0][0]).toEqual({
                Names: take(valuesIn(env), 10),
                WithDecryption: true
            });

            expect(ssm.getParameters.mock.calls[1][0]).toEqual({
                Names: [
                    '/path/to/ELEVENTHVAR',
                    '/path/to/TWELFTHVAR'
                ],
                WithDecryption: true
            });
        });

        it('add ssm parameters that exists to the event', () => {
            expect(result).toEqual({
                event: {
                    ssm: {
                        FIRSTVAR: '1st',
                        SIXTHVAR: '6th',
                        THIRDVAR: '3rd',
                        ELEVENTHVAR: '11th',
                        TWELFTHVAR: '12th'
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