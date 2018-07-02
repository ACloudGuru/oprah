'use strict';

const { populateConfig } = require('./populate-config');

describe('populateConfig', () => {
  let result;

  beforeAll(() => {
    return populateConfig({
      defaultPath: '../mocks/default.yaml',
      overridePath: '../mocks/override.yaml',
      ssmPath: 'ssm',
      variables: {}
    })
    .then(res => {
      result = res;
    });
  })

  it('should populate config', () => {
    expect(result).toEqual([]);
  });
});
