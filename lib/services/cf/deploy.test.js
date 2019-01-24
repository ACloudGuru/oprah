jest.mock('cfn', () => jest.fn());

const cfn = require('cfn');

const { makeCfService } = require('./make-cf-service');

describe('deploy', () => {
  beforeAll(() => {
    const cfService = makeCfService();
    return cfService.deploy({
      name: '1234',
      params: {
        hello: 'world'
      },
      template: '../../theCF.yml'
    })
  });

  it('should deploy the designated cf template', () => {
    expect(cfn.mock.calls[0][0]).toEqual({
      awsConfig: {
        region: 'us-east-1'
      },
      cfParams: {
        hello: 'world'
      },
      checkStackInterval: 5000,
      name: '1234',
      template: '../../theCF.yml'
    });
  });
});
