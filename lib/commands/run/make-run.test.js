const { makeRun } = require('./make-run');

const mockInit = jest.fn(() => Promise.resolve({}));
const mockConfigure = jest.fn(() => Promise.resolve({}));

describe('#makeRun', () => {
  it('should call both init and configure method', () => {
    const run = makeRun({ init: mockInit, configure: mockConfigure });

    return run().then(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledTimes(1);
    });
  });
});
