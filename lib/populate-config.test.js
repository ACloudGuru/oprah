'use strict';

const { populateConfig } = require('../index');

describe('populateConfig', () => {
  let result;

  beforeAll(() => {
    return populateConfig({
      defaultPath: __dirname + '/../mocks/default.yaml',
      overridePath: __dirname + '/../mocks/override.yaml',
      ssmPath: 'ssm',
      variables: {},
      noninteractive: true
    })
    .then(res => {
      result = res;
    });
  })

  it('should populate config', () => {
    // expect(result).toEqual([]);
  });
});
