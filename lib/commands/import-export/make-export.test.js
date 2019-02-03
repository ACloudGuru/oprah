const { makeExport } = require('./make-export');

const Bluebird = require('bluebird');

const fs = require('fs');

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

describe('export', () => {
  let exportFunction;
  const getSettingsMock = jest.fn();
  const getParametersMock = jest.fn();

  beforeEach(() => {
    exportFunction = makeExport({
      settingsService: {
        getSettings: getSettingsMock,
      },
      parameterStore: {
        getParameters: getParametersMock,
      },
    });
  });

  it('should write to the specified file path', () => {
    getSettingsMock.mockImplementation(() => Bluebird.resolve({
      secretParameters: [
        'path/to/secret1',
      ],
      configParameters: [
        'path/to/config1',
      ]
    }));

    getParametersMock
      .mockImplementationOnce(() => Bluebird.resolve({
        'path/to/secret1': 'secret1Value',
      }))
      .mockImplementationOnce(() => Bluebird.resolve({
        'path/to/config1': 'config1Value',
      }));

    const filePath = './test.json';

    return exportFunction(filePath)
      .then(() => {
        const writeOutput = {
          configs: {
            'path/to/config1': 'config1Value',
          },
          secrets: {
            'path/to/secret1': 'secret1Value',
          },
        };

        expect(fs.writeFileSync)
          .toHaveBeenCalledWith(filePath, JSON.stringify(writeOutput, null, 2))
      });
  });
});