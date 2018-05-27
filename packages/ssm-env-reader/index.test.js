'use strict';

const { ssmEnvReader } = require('./index');

jest.mock('aws-sdk', () => {
    return {
        SSM: jest.fn().mockImplementation(() => {
            return {
                getParameters: () => {
                    return {
                        promise: () => Promise.resolve({
                            Parameters: [
                                {
                                    Name: '/path/to/firstVar',
                                    Value: 'firstVar'
                                },
                                {
                                    Name: '/path/to/secondVar',
                                    Value: 'secondVar'
                                }
                            ],
                            InvalidParameters: [
                                '/path/to/nonexistant'
                            ]
                        })
                    }
                }
            };
        })
    };
  });

describe('ssmEnvReader', () => {
    beforeEach(() => {
        delete process.env.SSM_FIRSTVAR;
        delete process.env.SSM_SECONDVAR;
        delete process.env.SSM_NONEXISTANT;
    });

    const handler = (event, context, callback) => ({ event, context, callback });

    it('generates an event with all prefixed SSM environment variables', () => {
        process.env.SSM_FIRSTVAR = '/path/to/firstVar'
        process.env.SSM_SECONDVAR = '/path/to/secondVar'
        process.env.SSM_NONEXISTANT = '/path/to/nonexistant'

        const lambdaHandler = ssmEnvReader(handler);
        const cb = () => {};
        const mockedContext = { existing: 'property' };

        const promise = lambdaHandler({}, mockedContext, cb);

        return promise.then(result => {
            expect(result).toEqual({
                event: {
                    ssm: {
                        FIRSTVAR: 'firstVar',
                        SECONDVAR: 'secondVar'
                    }
                },
                context: {
                    existing: 'property'
                },
                callback: cb
            });
        });
    });

    it('does not alter the event if there are no SSM vars', () => {
        const lambdaHandler = ssmEnvReader(handler);
        const cb = () => {};
        const mockedContext = { existing: 'property' };

        const promise = lambdaHandler({}, mockedContext, cb);

        return promise.then(result => {
            expect(result).toEqual({
                event: {},
                context: {
                    existing: 'property'
                },
                callback: cb
            });
        });
    });
});