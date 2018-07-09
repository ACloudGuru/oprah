'use strict';

const validateKeys = require('./validateKeys');

describe('#validateKeys', () => {
  it('should throw an error on missing keys', () => {
    const event = {
      ssm: {
        SECRET_KEY: 'secret key'
      }
    };

    expect(() => validateKeys(event, ['ssm.SECRET_KEY', 'firebaseRef'])).toThrow(`Could not find path: firebaseRef`);
  });

  it('should provide the values of all keys requested', () => {
    const event = {
      ssm: {
        SECRET_KEY: 'secret key',
        TEST_KEY: 'test key',
        FOO: 'bar'
      },
      firebaseRef: {
        url: 'blah.com',
        connection: {
          pool: 100
        }
      }
    };

    const { SECRET_KEY, TEST_KEY, firebaseRef } = validateKeys(event, ['ssm.TEST_KEY', 'firebaseRef', 'ssm.SECRET_KEY']);

    expect(SECRET_KEY).toEqual('secret key');
    expect(TEST_KEY).toEqual('test key');
    expect(firebaseRef).toEqual({
      url: 'blah.com',
      connection: {
        pool: 100
      }
    });
  });
});
