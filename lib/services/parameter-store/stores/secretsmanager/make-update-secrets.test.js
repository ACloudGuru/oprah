const mockGetBatchSecrets = jest.fn();
jest.mock('./get-batch-secrets', () => ({
  getBatchSecrets: (...args) => mockGetBatchSecrets(...args)
}));

const mockPutSecretValue = jest.fn();
const mockCreateSecret = jest.fn();

const AWS = require('aws-sdk');

AWS.SecretsManager.mockImplementation(() => ({
  putSecretValue: mockPutSecretValue,
  createSecret: mockCreateSecret
}));

const mockOnComplete = jest.fn();

const { makeSecretsManagerStore } = require('./make-secretsmanager-store');

describe('updateSecrets (secrets manager)', () => {
  beforeEach(() => {
    mockGetBatchSecrets.mockReset();
    mockPutSecretValue.mockReset();
    mockCreateSecret.mockReset();
    mockOnComplete.mockReset();
  });

  describe('when secrets exist', () => {
    beforeEach(() => {
      mockGetBatchSecrets.mockImplementation(({ parameterNames }) =>
        Promise.resolve(
          parameterNames.map(name => {
            if (name === 'HELLO') return 'OLD_WORLD';
            if (name === 'FOO') return 'OLD_BAR';
            if (name === 'PARAM') return 'UNCHANGED';
            return '';
          })
        )
      );
      mockPutSecretValue.mockImplementation(() => ({
        promise: () => Promise.resolve({ VersionId: 'v1' })
      }));

      const store = makeSecretsManagerStore();

      return store.updateSecrets({
        parameters: {
          HELLO: 'WORLD',
          FOO: 'BAR',
          PARAM: 'UNCHANGED'
        },
        onComplete: mockOnComplete
      });
    });

    it('should put secret values for changed secrets', () => {
      expect(mockPutSecretValue).toBeCalledWith({
        SecretId: 'HELLO',
        SecretString: 'WORLD'
      });

      expect(mockPutSecretValue).toBeCalledWith({
        SecretId: 'FOO',
        SecretString: 'BAR'
      });
    });

    it('should not put secrets which have not changed', () => {
      expect(mockPutSecretValue).not.toBeCalledWith({
        SecretId: 'PARAM',
        SecretString: 'UNCHANGED'
      });

      expect(mockPutSecretValue.mock.calls.length).toEqual(2);
    });

    it('should run onComplete hook for each updated secret', () => {
      expect(mockOnComplete).toBeCalledWith({
        name: 'HELLO',
        value: 'WORLD',
        version: 'v1'
      });

      expect(mockOnComplete).toBeCalledWith({
        name: 'FOO',
        value: 'BAR',
        version: 'v1'
      });
    });
  });

  describe('when a secret does not yet exist', () => {
    beforeEach(() => {
      mockGetBatchSecrets.mockImplementation(({ parameterNames }) =>
        Promise.resolve(parameterNames.map(() => ''))
      );

      const notFound = new Error('not found');
      notFound.code = 'ResourceNotFoundException';

      mockPutSecretValue.mockImplementation(() => ({
        promise: () => Promise.reject(notFound)
      }));
      mockCreateSecret.mockImplementation(() => ({
        promise: () => Promise.resolve({ VersionId: 'created' })
      }));

      const store = makeSecretsManagerStore();

      return store.updateSecrets({
        parameters: { NEW_KEY: 'NEW_VALUE' }
      });
    });

    it('should fall back to createSecret', () => {
      expect(mockPutSecretValue).toBeCalledWith({
        SecretId: 'NEW_KEY',
        SecretString: 'NEW_VALUE'
      });

      expect(mockCreateSecret).toBeCalledWith({
        Name: 'NEW_KEY',
        SecretString: 'NEW_VALUE'
      });
    });
  });

  describe('when onComplete is not provided', () => {
    it('should still persist the secret', () => {
      mockGetBatchSecrets.mockImplementation(({ parameterNames }) =>
        Promise.resolve(parameterNames.map(() => ''))
      );
      mockPutSecretValue.mockImplementation(() => ({
        promise: () => Promise.resolve({ VersionId: 'v1' })
      }));

      const store = makeSecretsManagerStore();

      return store
        .updateSecrets({ parameters: { HELLO: 'WORLD' } })
        .then(() => {
          expect(mockPutSecretValue).toBeCalledWith({
            SecretId: 'HELLO',
            SecretString: 'WORLD'
          });
        });
    });
  });
});
