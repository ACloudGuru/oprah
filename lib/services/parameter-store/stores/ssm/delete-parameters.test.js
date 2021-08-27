const mockDeleteParameters = jest.fn().mockImplementation(() => ({
  promise: () => Promise.resolve({})
}));

const AWS = require('aws-sdk');

AWS.SSM.mockImplementation(() => ({
  deleteParameters: mockDeleteParameters
}));

const { makeSsmStore } = require('./make-ssm-store');

describe('deleteParameters', () => {
  it('should delete parameters in batches', async () => {
    const parameterNames = [...Array(35).keys()].map(key => `/test/${key}`);

    const ssm = makeSsmStore();

    await ssm.deleteParameters({ parameterNames });

    expect(mockDeleteParameters.mock.calls.length).toEqual(4);
  });
});
