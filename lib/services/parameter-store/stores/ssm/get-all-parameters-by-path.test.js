const mockGetParametersByPath = jest
  .fn()
  .mockImplementationOnce(() => ({
    promise: () =>
      Promise.resolve({
        Parameters: [
          {
            Name: 'TEST/ONE',
            Value: '1'
          }
        ],
        NextToken: 'first-token'
      })
  }))
  .mockImplementationOnce(() => ({
    promise: () =>
      Promise.resolve({
        Parameters: [
          {
            Name: 'TEST/TWO',
            Value: '2'
          }
        ],
        NextToken: 'second-token'
      })
  }))
  .mockImplementationOnce(() => ({
    promise: () =>
      Promise.resolve({
        Parameters: [
          {
            Name: 'TEST/THREE',
            Value: '1'
          }
        ]
      })
  }));

const AWS = require('aws-sdk');

AWS.SSM.mockImplementation(() => ({
  getParametersByPath: mockGetParametersByPath
}));

const { makeSsmStore } = require('./make-ssm-store');

describe('getAllParameterByPath', () => {
  it('should get parameters recursively', async () => {
    const ssm = makeSsmStore();
    const parameters = await ssm.getAllParametersByPath({ path: 'TEST' });
    expect(parameters).toEqual([
      {
        Name: 'TEST/ONE',
        Value: '1'
      },
      {
        Name: 'TEST/TWO',
        Value: '2'
      },
      {
        Name: 'TEST/THREE',
        Value: '1'
      }
    ]);
  });
});
