const mockDeleteParameters = jest.fn(() => Promise.resolve({}));

const { makeDeleteParameters } = require('./make-delete-parameters');

const deleteParameters = makeDeleteParameters({
  getProviderStore: () =>
    Promise.resolve({
      deleteParameters: mockDeleteParameters
    })
});
describe('deleteParameters', () => {
  it('should delete all parameters', async () => {
    mockDeleteParameters.mockClear();

    expect.assertions(1);

    await deleteParameters({
      parameterNames: ['CONFIG_1', 'SECRET_1']
    });
    expect(mockDeleteParameters.mock.calls[0][0]).toEqual({
      parameterNames: ['CONFIG_1', 'SECRET_1']
    });
  });
});
