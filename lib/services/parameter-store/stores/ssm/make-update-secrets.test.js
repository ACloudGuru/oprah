const Bluebird = require('bluebird');

const mockPutParameter = jest.fn(() => ({
  promise: () => Bluebird.resolve({ Version: 0 })
}));

const AWS = require('aws-sdk');
AWS.SSM.mockImplementation(function () {
  return {
    putParameter: mockPutParameter
  };
});

const mockOnComplete = jest.fn();

const { makeUpdateSecrets } = require('./make-update-secrets');

describe('updateSecrets', () => {

  describe('when an onCompleteHook is provided', () => {
    beforeAll(() => {
      const updateSecrets =  makeUpdateSecrets();
      return updateSecrets({
        parameters: {
          'HELLO': 'WORLD',
          'FOO': 'BAR'
        },
        onComplete: mockOnComplete
      });
    })

    it('should update secrets in ssm using the default encryption key', () => {
      expect(mockPutParameter.mock.calls[0][0]).toEqual({
        KeyId: 'alias/aws/ssm',
        Name: 'HELLO',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'WORLD'
      });

      expect(mockPutParameter.mock.calls[1][0]).toEqual({
        KeyId: 'alias/aws/ssm',
        Name: 'FOO',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'BAR'
      });
    });

    it('should run onComplete hook for each parameter', () => {
      expect(mockOnComplete.mock.calls[0][0]).toEqual({
        name: 'HELLO',
        value: 'WORLD',
        version: 0
      });

      expect(mockOnComplete.mock.calls[1][0]).toEqual({
        name: 'FOO',
        value: 'BAR',
        version: 0
      });
    });
  });

  describe('when an onComplete hook is not provided', () => {
    it('should still persist the secret in ssm', () => {
      mockPutParameter.mockClear();

      expect.assertions(1);

      const updateSecrets =  makeUpdateSecrets();
      return updateSecrets({
        parameters: {
          'HELLO': 'WORLD'
        }
      })
      .then(() => {
        expect(mockPutParameter.mock.calls[0][0]).toEqual({
          KeyId: 'alias/aws/ssm',
          Name: 'HELLO',
          Overwrite: true,
          Type: 'SecureString',
          Value: 'WORLD'
        });
      });
    });
  });
});
