'use strict';

const { populateConfig } = require('./index');

describe('populateConfig', () => {
  let result;

  beforeAll(() => {
    return populateConfig({
      defaults: {},
      overrides: {},
      config: {
        path: 'config path'
      },
      noninteractive: true
    })
    .then(res => {
      result = res;
    });
  })

  it('should populate config', () => {
    console.log(result);
    // expect(result).toEqual([]);
  });
});
