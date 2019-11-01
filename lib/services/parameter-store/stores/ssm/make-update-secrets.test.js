const Bluebird = require('bluebird');

jest.mock('./get-batch-parameters', () => ({
  getBatchParameters: () => Promise.resolve(['OLD_WORLD', 'OLD_BAR', 'UNCHANGED'])
}));

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

const { makeSsmStore } = require('./make-ssm-store');
const ssmStore = makeSsmStore();

describe('updateSecrets', () => {

  describe('when an onCompleteHook is provided', () => {
    beforeAll(() => {
      return ssmStore.updateSecrets({
        parameters: {
          'HELLO': 'WORLD',
          'FOO': 'BAR',
          'PARAM': 'UNCHANGED'
        },
        onComplete: mockOnComplete
      });
    })

    it('should update secrets in ssm using the default encryption key', () => {
      expect(mockPutParameter).toBeCalledWith({
        KeyId: 'alias/aws/ssm',
        Name: 'HELLO',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'WORLD'
      });

      expect(mockPutParameter).toBeCalledWith({
        KeyId: 'alias/aws/ssm',
        Name: 'FOO',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'BAR'
      });
    });

    it('should not update secrets which have not changed', () => {
      expect(mockPutParameter).not.toBeCalledWith({
        KeyId: 'alias/aws/ssm',
        Name: 'PARAM',
        Overwrite: true,
        Type: 'SecureString',
        Value: 'UNCHANGED'
      });

      expect(mockPutParameter.mock.calls.length).toEqual(2);
    });

    it('should run onComplete hook for each parameter', () => {
      expect(mockOnComplete).toBeCalledWith({
        name: 'HELLO',
        value: 'WORLD',
        version: 0
      });

      expect(mockOnComplete).toBeCalledWith({
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

      return ssmStore.updateSecrets({
        parameters: {
          'HELLO': 'WORLD'
        }
      })
      .then(() => {
        expect(mockPutParameter).toBeCalledWith({
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
