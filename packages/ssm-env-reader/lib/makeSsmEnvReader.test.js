'use strict';

const { valuesIn, take } = require('lodash');
const Bluebird = require('bluebird');

jest.mock('aws-sdk', () => {
    return {
        SSM: function() {
            return {
                getParameters: mockGetParameters
            };
        }
    };
});

const mockGetParameters = jest.fn(() => ({ promise: mockPromise }))
const mockPromise = jest.fn()

const makeSsmEnvReader = require('./makeSsmEnvReader');

describe('makeSsmEnvReader', () => {
    describe('when the number of parameters exceed 10', () => {
        mockPromise.mockImplementationOnce(() => Promise.resolve({
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

        const handler = (event, context, callback) => ({ event, context, callback });
        const cb = () => {};
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
            const lambdaHandler = makeSsmEnvReader({ env })(handler);
            const mockedContext = { existing: 'property' };

            return lambdaHandler({}, mockedContext, cb)
            .then(res => {
                result = res;
            });
        });

        it('sends getParameters in chunks of 10 when the requested parameter list exceeds 10', () => {
            expect(mockGetParameters.mock.calls[0][0]).toEqual({
                Names: take(valuesIn(env), 10),
                WithDecryption: true
            });

            expect(mockGetParameters.mock.calls[1][0]).toEqual({
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

    describe('when the cache is still valid', () => {
        mockPromise
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

        const handler = (event, context, callback) => ({ event, context, callback });
        const cb = () => {};
        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR'
        };
        let result;

        beforeAll(() => {
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
            expect(mockGetParameters.mock.calls.length).toEqual(1);
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

    describe('when the cache has expired', () => {
        mockPromise
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

        const handler = (event, context, callback) => ({ event, context, callback });
        const cb = () => {};
        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR'
        };
        let result;

        beforeAll(() => {
            const ssmEnvReader = makeSsmEnvReader({
                env,
                cacheDuration: 100,
                getCurrentDate: () => '2018-05-28T01:59:08.523Z'
            });
            const lambdaHandler = ssmEnvReader(handler);
            const mockedContext = { existing: 'property' };

            // Simulate multiple calls
            return Bluebird.resolve()
            .then(() => lambdaHandler({}, mockedContext, cb))
            .then(() => lambdaHandler({}, mockedContext, cb))
            .then(() => lambdaHandler({}, mockedContext, cb))
            .delay(2000)
            .then(res => {
                result = res;
            });
        });

        it('should call ssm again when cache expires', () => {
            expect(mockGetParameters.mock.calls.length).toEqual(2);
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