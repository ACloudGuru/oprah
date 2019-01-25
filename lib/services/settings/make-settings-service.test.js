const path = require('path');

const mockGetSettings = jest.fn(() => Promise.resolve({
  provider: {
    name: 'ddb'
  },
  config: {
    the: 'config'
  }
}));
jest.mock('./make-get-settings', () => ({
  makeGetSettings: () => mockGetSettings
}));

const { makeSettingsService } = require('./make-settings-service');

const settingsService = makeSettingsService({
  settingsFilePath: path.resolve(process.cwd(), './examples/dynamodb-provider.yml'),
  cfService: {},
  variables: {}
});

describe('settingsService', () => {
  it('should cache settings per instance of settings service', () => {
    expect.assertions(2);

    return Promise.all([
      settingsService.getSettings(),
      settingsService.getSettings(),
      settingsService.getSettings(),
      settingsService.getSettings(),
      settingsService.getSettings()
    ])
    .then(([settings]) => {
      expect(settings).toEqual({
        provider: {
          name: 'ddb'
        },
        config: {
          the: 'config'
        }
      });
      expect(mockGetSettings.mock.calls.length).toEqual(1);
    })
  });

  it('should return the provider', () => {
    expect.assertions(1);

    return settingsService.getProvider()
      .then(provider => {
        expect(provider).toEqual({
          name: 'ddb'
        });
      });
  });
});