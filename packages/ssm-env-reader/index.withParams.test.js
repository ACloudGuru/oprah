'use strict';

const { ssmEnvReader, validateKeys } = require('./index');

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
                  };
              }
          };
      })
  };
});

describe('#validateKeys', () => {
  it('is a function', () => {
    expect(typeof validateKeys).toEqual('function');
  });
});

describe('ssmEnvReader', () => {
    const handler = (event, context, callback) => ({ event, context, callback });

    it('generates an event with all prefixed SSM environment variables', () => {
        process.env.SSM_FIRSTVAR = '/path/to/firstVar';
        process.env.SSM_SECONDVAR = '/path/to/secondVar';
        process.env.SSM_NONEXISTANT = '/path/to/nonexistant';

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
});

