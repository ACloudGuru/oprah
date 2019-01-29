const mockGetLatestVersion = jest.fn();
const mockPushParameter = jest.fn(() => Promise.resolve());
const mockOnComplete = jest.fn();

const { makeUpdateParameters } = require('./make-update-parameters');

const updateParameters = makeUpdateParameters({
  getLatestVersion: mockGetLatestVersion,
  pushParameter: mockPushParameter
});

describe('updateParameters', () => {
  beforeAll(() => {
    mockGetLatestVersion.mockImplementation(({ parameterName }) => {
      const ddbStore = {
        CONFIG1: {
          name: 'CONFIG1',
          value: 'config 1',
          version: '00000000000000000006'
        }
      };

      return Promise.resolve(ddbStore[parameterName])
    })

    return updateParameters({
      parameters: {
        CONFIG1: 'new config 1',
        CONFIG4: 'config 4'
      },
      onComplete: mockOnComplete
    });
  })

  it('should increment the version of the parameter before pushing', () => {
    expect(mockPushParameter.mock.calls[0][0]).toEqual({
      name: 'CONFIG1',
      value: 'new config 1',
      version: '00000000000000000007'
    });

    expect(mockPushParameter.mock.calls[1][0]).toEqual({
      name: 'CONFIG4',
      value: 'config 4',
      version: '00000000000000000001'
    });

    expect(mockPushParameter.mock.calls.length).toEqual(2);
  });

  it('should run the onComplete hook for every parameter', () => {
    expect(mockOnComplete.mock.calls.length).toEqual(2);
  });
});
