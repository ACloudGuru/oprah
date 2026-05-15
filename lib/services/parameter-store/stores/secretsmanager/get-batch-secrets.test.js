const mockGetSecretValue = jest.fn();

const AWS = require('aws-sdk');

AWS.SecretsManager.mockImplementation(() => ({
  getSecretValue: mockGetSecretValue
}));

const { getBatchSecrets } = require('./get-batch-secrets');

describe('getBatchSecrets', () => {
  beforeEach(() => {
    mockGetSecretValue.mockReset();
  });

  it('should return secret values in the order requested', () => {
    mockGetSecretValue
      .mockImplementationOnce(() => ({
        promise: () => Promise.resolve({ SecretString: 'one' })
      }))
      .mockImplementationOnce(() => ({
        promise: () => Promise.resolve({ SecretString: 'two' })
      }));

    return getBatchSecrets({ parameterNames: ['a', 'b'] }).then(values => {
      expect(values).toEqual(['one', 'two']);
      expect(mockGetSecretValue).toHaveBeenCalledWith({ SecretId: 'a' });
      expect(mockGetSecretValue).toHaveBeenCalledWith({ SecretId: 'b' });
    });
  });

  it('should return empty string for secrets that do not exist', () => {
    const notFound = new Error('not found');
    notFound.code = 'ResourceNotFoundException';

    mockGetSecretValue
      .mockImplementationOnce(() => ({
        promise: () => Promise.resolve({ SecretString: 'one' })
      }))
      .mockImplementationOnce(() => ({
        promise: () => Promise.reject(notFound)
      }));

    return getBatchSecrets({ parameterNames: ['a', 'missing'] }).then(
      values => {
        expect(values).toEqual(['one', '']);
      }
    );
  });

  it('should rethrow non-ResourceNotFoundException errors', () => {
    const boom = new Error('boom');
    boom.code = 'AccessDeniedException';

    mockGetSecretValue.mockImplementationOnce(() => ({
      promise: () => Promise.reject(boom)
    }));

    return expect(getBatchSecrets({ parameterNames: ['a'] })).rejects.toThrow(
      'boom'
    );
  });
});
