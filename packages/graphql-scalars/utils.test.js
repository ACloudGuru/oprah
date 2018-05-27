'use strict';

const { toISOString } = require('./utils');

describe('toISOString method', () => {
  it('should be return iso date string if valid date is passed', () => {
    expect(toISOString('10-2-2018')).toEqual('2018-10-01T14:00:00.000Z');
    expect(toISOString('11-13-2018')).toEqual('2018-11-12T13:00:00.000Z');
  });

  it('should be return null if invalid date is passed', () => {
    expect(toISOString('13-13-2018')).toBeNull();
  });

  it ('should return null if no date is passed', () => {
    expect(toISOString()).toBeNull();
    expect(toISOString(false)).toBeNull();
    expect(toISOString(undefined)).toBeNull();
  });
});

