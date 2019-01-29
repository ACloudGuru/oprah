jest.mock('./stores/ssm/make-ssm-store', () => ({
  makeSsmStore: jest.fn(() => 'ssm')
}));

const mockMakeDdbStore = jest.fn(() => 'ddb');

jest.mock('./stores/ddb/make-ddb-store', () => ({
  makeDdbStore: mockMakeDdbStore
}))

const { makeGetProviderStore } = require('./make-get-provider-store');

describe('getProviderStore', () => {
  describe('when the provider is ssm', () => {
    it('should return the ssm store', () => {
      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () => Promise.resolve({
            provider: {
              name: 'ssm'
            }
          })
        }
      });

      expect.assertions(1);

      return getProviderStore()
      .then(store => {
        expect(store).toEqual('ssm');
      });
    });
  });

  describe('when the provider is ddb', () => {
    it('should return the ddb store', () => {
      mockMakeDdbStore.mockClear();

      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () => Promise.resolve({
            provider: {
              name: 'ddb',
              tableName: 'theTable'
            }
          })
        }
      });

      expect.assertions(2);

      return getProviderStore()
      .then(store => {
        expect(store).toEqual('ddb');

        expect(mockMakeDdbStore.mock.calls[0][0]).toEqual({
          tableName: 'theTable'
        })
      });
    });
  });

  describe('when the provider is unsupported', () => {
    it('should throw an error', () => {
      const getProviderStore = makeGetProviderStore({
        settingsService: {
          getSettings: () => Promise.resolve({
            provider: {
              name: 'somethingUnsupported'
            }
          })
        }
      });

      expect.assertions(1);

      return expect(getProviderStore()).rejects.toEqual(new Error('Unsupported provider specified'));
    });
  });
});