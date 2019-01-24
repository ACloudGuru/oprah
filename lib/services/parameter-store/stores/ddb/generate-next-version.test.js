const { generateNextVersionNumber } = require('./generate-next-version-number');

describe('generateNextVersion', () => {

  it('should return initial value if currentVersionNumber is not set', () => {
    let currentVersionNumber = null;
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000001');

    currentVersionNumber = undefined;
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000001');

    currentVersionNumber = '';
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000001');
  });

  it('should return next version number', () => {
    let currentVersionNumber = '00000000000000000001';
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000002');

    currentVersionNumber = '00000000000000000002';
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000003');

    currentVersionNumber = '00000000000000000015';
    expect(generateNextVersionNumber({ currentVersionNumber })).toEqual('00000000000000000016');
  });

  it('should throw if currentVersionNumber is nan', () => {
    const currentVersionNumber = 'abc';

    expect(() => generateNextVersionNumber({ currentVersionNumber }))
      .toThrow(`Cannot generate next version number for 'abc'. Current version number must be number.`);
  });
});
