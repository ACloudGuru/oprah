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

  it('should call init, configuration but not cleanUp if removing is not required', () =>
    run({ removing: false }).then(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledTimes(1);
      expect(mockCleanUp).not.toHaveBeenCalled();
    }));

  it('should call init, configuration and cleanUp if removing is required', () =>
    run({ removing: true }).then(() => {
      expect(mockInit).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledTimes(1);
      expect(mockCleanUp).toHaveBeenCalledTimes(1);
    }));
});
