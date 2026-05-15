const { makeSecretsManagerStore } = require('./make-secretsmanager-store');

describe('makeSecretsManagerStore', () => {
  it('should make an instance of secrets manager store', () => {
    const store = makeSecretsManagerStore();

    expect(store).toHaveProperty('getAllParametersByNames');
    expect(store).toHaveProperty('updateSecrets');
  });
});
