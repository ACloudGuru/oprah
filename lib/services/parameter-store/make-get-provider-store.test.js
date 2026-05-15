jest.mock('./stores/ssm/make-ssm-store', () => ({
  makeSsmStore: jest.fn(() => 'ssm')
}));

jest.mock('./stores/secretsmanager/make-secretsmanager-store', () => ({
  makeSecretsManagerStore: jest.fn(() => 'secretsmanager')
}));

const { makeGetProviderStore } = require('./make-get-provider-store');

describe('getProviderStore', () => {
  describe('when the provider is ssm', () => {
    it('should return the ssm store', () => {
      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () =>
            Promise.resolve({
              provider: {
                name: 'ssm'
              }
            })
        }
      });

      expect.assertions(1);

      return getProviderStore().then(store => {
        expect(store).toEqual('ssm');
      });
    });
  });

  describe('when the provider is secretsmanager', () => {
    it('should return the secrets manager store', () => {
      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () =>
            Promise.resolve({
              provider: {
                name: 'secretsmanager'
              }
            })
        }
      });

      expect.assertions(1);

      return getProviderStore().then(store => {
        expect(store).toEqual('secretsmanager');
      });
    });
  });

  describe('when the provider is unsupported', () => {
    it('should throw an error', () => {
      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () =>
            Promise.resolve({
              provider: {
                name: 'somethingUnsupported'
              }
            })
        }
      });

      expect.assertions(1);

      return expect(getProviderStore()).rejects.toEqual(
        new Error('Unsupported provider specified')
      );
    });
  });
});
