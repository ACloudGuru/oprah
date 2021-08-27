const { makeRun } = require('./make-run');

const mockInit = jest.fn(() => Promise.resolve({}));
const mockConfigure = jest.fn(() => Promise.resolve({}));
const mockCleanUp = jest.fn(() => Promise.resolve({}));

describe('#makeRun', () => {
  const run = makeRun({
    init: mockInit,
    configure: mockConfigure,
    cleanUp: mockCleanUp
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call init, configuration but not cleanUp if deleting is not required', () =>
    run({ deleting: false }).then(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledTimes(1);
      expect(mockCleanUp).not.toHaveBeenCalled();
    }));

  it('should call init, configuration and cleanUp if deleting is required', () =>
    run({ deleting: true }).then(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledTimes(1);
      expect(mockCleanUp).toHaveBeenCalledTimes(1);
    }));
});
