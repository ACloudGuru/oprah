const path = require('path');

const mockMakeSettingsService = jest.fn(() => ({}));
const mockMakeRun = jest.fn(() => ({}));

jest.mock('./services/settings/make-settings-service', () => ({
  makeSettingsService: mockMakeSettingsService
}));

jest.mock('./commands/run/make-run', () => ({
  makeRun: mockMakeRun
}));

const { makeOprah } = require('./make-oprah');

describe('makeOprah', () => {
  it('should resolve the config path if it is provided', () => {
    mockMakeSettingsService.mockClear();
    makeOprah({
      stage: 'test',
      config: './hello.yml'
    });

    const expectedPath = path.resolve(process.cwd(), './hello.yml');

    expect(mockMakeSettingsService.mock.calls[0][0].settingsFilePath).toEqual(expectedPath);
  });

  it('should default the config path to oprah.yml when it is not provided', () => {
    mockMakeSettingsService.mockClear();
    makeOprah({
      stage: 'test'
    });

    const expectedPath = path.resolve(process.cwd(), './oprah.yml');

    expect(mockMakeSettingsService.mock.calls[0][0].settingsFilePath).toEqual(expectedPath);
  });

  it('should merge the stage into variables', () => {
    mockMakeSettingsService.mockClear();
    makeOprah({
      stage: 'test',
      variables: {
        hello: 'world'
      }
    });

    expect(mockMakeSettingsService.mock.calls[0][0].variables).toEqual({
      hello: 'world',
      stage: 'test'
    });
  });

  it('should default to non-interactive mode', () => {
    mockMakeRun.mockClear();
    makeOprah({
      stage: 'test',
      variables: {
        hello: 'world'
      }
    });

    expect(mockMakeRun.mock.calls[0][0].interactive).toEqual(false);
  });

  it('should run in interactive mode if interactive flag is specified', () => {
    mockMakeRun.mockClear();
    makeOprah({
      stage: 'test',
      variables: {
        hello: 'world'
      },
      interactive: true
    });

    expect(mockMakeRun.mock.calls[0][0].interactive).toEqual(true);
  });
});
