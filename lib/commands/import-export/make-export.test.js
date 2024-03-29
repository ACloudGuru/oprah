const fs = require('fs');
const { makeExport } = require('./make-export');

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

describe('export', () => {
  let exportFunction;
  const getSettingsMock = jest.fn();
  const getParametersMock = jest.fn();

  beforeAll(() => {
    exportFunction = makeExport({
      settingsService: {
        getSettings: getSettingsMock
      },
      parameterStore: {
        getParameters: getParametersMock
      }
    });
  });

  beforeEach(() => {
    getSettingsMock.mockImplementation(() =>
      Promise.resolve({
        secretParameters: ['path/to/secret1'],
        configParameters: ['path/to/config1']
      })
    );
  });

  afterEach(() => {
    fs.writeFileSync.mockClear();
  });

  it('should write JSON version to the specified file path', () => {
    getParametersMock
      .mockImplementationOnce(() =>
        Promise.resolve({
          'path/to/secret1': 'secret1Value'
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          'path/to/config1': 'config1Value'
        })
      );

    const filePath = './test.json';

    return exportFunction(filePath).then(() => {
      const writeOutput = {
        configs: {
          'path/to/config1': 'config1Value'
        },
        secrets: {
          'path/to/secret1': 'secret1Value'
        }
      };

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(writeOutput, null, 2)
      );
    });
  });

  it('should write ENV version to the specified file path', () => {
    const filePath = './.env.test';
    const target = 'env';
    getParametersMock
      .mockImplementationOnce(() =>
        Promise.resolve({
          'path/to/secret1': 'secret1Value'
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          'path/to/config1': 'config1Value'
        })
      );
    return exportFunction(filePath, target).then(() => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        'path_to_config1="config1Value"\npath_to_secret1="secret1Value"\n'
      );
    });
  });

  it('should only get parameters for configs if configOnly is true', async () => {
    getParametersMock.mockImplementationOnce(() =>
      Promise.resolve({
        'path/to/config1': 'config1Value'
      })
    );
    const filePath = './.env.test';
    const target = 'env';

    return exportFunction(filePath, target, true).then(() => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        'path_to_config1="config1Value"\n'
      );
    });
  });
});
