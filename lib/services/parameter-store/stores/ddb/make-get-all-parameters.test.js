const mockGetLatestVersion = jest.fn();

const { makeGetAllParameters } = require('./make-get-all-parameters');

const getAllParameters = makeGetAllParameters({
  getLatestVersion: mockGetLatestVersion
});

describe('getAllParameters', () => {
  it('should retrieve all the parameters that exists', () => {
    mockGetLatestVersion
      .mockImplementation(({ parameterName }) => {
        const ddbStore = {
          CONFIG1: {
            name: 'CONFIG1',
            value:'config 1'
          },
          CONFIG2: {
            name: 'CONFIG2',
            value:'config 2'
          },
          CONFIG3: {
            name: 'CONFIG3',
            value:'config 3'
          }
        };
        return Promise.resolve(ddbStore[parameterName]);
      });

    return getAllParameters({ parameterNames: ['CONFIG1', 'CONFIG6', 'CONFIG2']})
    .then(result => {

      expect(mockGetLatestVersion.mock.calls[0][0]).toEqual({
        parameterName: 'CONFIG1'
      });

      expect(mockGetLatestVersion.mock.calls[1][0]).toEqual({
        parameterName: 'CONFIG6'
      });

      expect(mockGetLatestVersion.mock.calls[2][0]).toEqual({
        parameterName: 'CONFIG2'
      });

      expect(result).toEqual({
        CONFIG1: 'config 1',
        CONFIG2: 'config 2'
      });
    });
  });
});