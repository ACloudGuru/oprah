const mockGray = jest.fn();

jest.mock('chalk', () => ({
  gray: mockGray
}));

const { listParameters } = require('./list-parameters');

describe('list-parameters', () => {
  it('should list all parameters provided', () => {
    mockGray.mockClear();

    const parameters = {
      hello: 'world',
      foo: 'bar'
    };

    listParameters({ parameters });

    expect(mockGray.mock.calls[0][0]).toEqual('  hello: world');
    expect(mockGray.mock.calls[1][0]).toEqual('  foo: bar');
    expect(mockGray.mock.calls.length).toEqual(2);
  });

  it('should mask parameters if the mask flag is provided', () => {
    mockGray.mockClear();

    const parameters = {
      hello: 'wholenewworld',
      foo: 'bar'
    };

    listParameters({
      parameters,
      mask: true
    });

    expect(mockGray.mock.calls[0][0]).toEqual('  hello: *********orld');
    expect(mockGray.mock.calls[1][0]).toEqual('  foo: bar');
    expect(mockGray.mock.calls.length).toEqual(2);
  });
});