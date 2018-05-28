'use strict';

const { ssmEnvReader } = require('./index');

jest.mock('aws-sdk', () => {
    return {
        SSM: jest.fn().mockImplementation(() => {
            return {
                getParameters: () => {
                    return {
                        promise: jest.fn(() => Promise.resolve({
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
                        }))
                    }
                }
            };
        })
    };
  });

describe('ssmEnvReader', () => {
    const handler = (event, context, callback) => ({ event, context, callback });

    it('does not add any SSM vars if there are no SSM vars', () => {
        const lambdaHandler = ssmEnvReader(handler);
        const cb = () => {};
        const mockedContext = { existing: 'property' };

        const promise = lambdaHandler({}, mockedContext, cb);

        return promise.then(result => {
            expect(result).toEqual({
                event: {
                    ssm: {}
                },
                context: {
                    existing: 'property'
                },
                callback: cb
            });
        });
    });
});