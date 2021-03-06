const fs = require('fs');
const { makeImport } = require('./make-import');

jest.mock('fs', () => ({
  readFileSync: jest.fn()
}));

describe('import', () => {
  let importFunction;
  const getSettingsMock = jest.fn();
  const updateConfigsMock = jest.fn();
  const updateSecretsMock = jest.fn();

  beforeEach(() => {
    importFunction = makeImport({
      settingsService: {
        getSettings: getSettingsMock
      },
      parameterStore: {
        updateConfigs: updateConfigsMock,
        updateSecrets: updateSecretsMock
      }
    });
  });

  it('should write to the specified file path', () => {
    const readResult = {
      configs: {
        'path/to/config1': 'config1Value'
      },
      secrets: {
        'path/to/secret1': 'secret1Value'
      }
    };

    getSettingsMock.mockImplementation(() =>
      Promise.resolve({
        config: {
          path: 'service/path'
        },
        secret: {
          path: 'service/path'
        },
        secretParameters: ['path/to/secret1'],
        configParameters: ['path/to/config1']
      })
    );

    updateConfigsMock.mockImplementation(() => Promise.resolve());

    updateSecretsMock.mockImplementation(() => Promise.resolve());

    fs.readFileSync.mockImplementation(() =>
      JSON.stringify(readResult, null, 2)
    );

    const filePath = './test.json';

    return importFunction(filePath).then(() => {
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);

      expect(updateConfigsMock).toHaveBeenCalledWith({
        parameters: {
          'service/path/path/to/config1': 'config1Value'
        }
      });

      expect(updateSecretsMock).toHaveBeenCalledWith({
        parameters: {
          'service/path/path/to/secret1': 'secret1Value'
        }
      });
    });
  });
});
