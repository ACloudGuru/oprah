const { getRegion } = require('./get-region');

describe('getRegion', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.AWS_REGION;
    delete process.env.AWS_DEFAULT_REGION;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should default to us-east-1 when no env vars set', () => {
    expect(getRegion()).toEqual('us-east-1');
  });

  it('should use AWS_REGION when set', () => {
    process.env.AWS_REGION = 'us-west-2';
    expect(getRegion()).toEqual('us-west-2');
  });

  it('should use AWS_DEFAULT_REGION when AWS_REGION not set', () => {
    process.env.AWS_DEFAULT_REGION = 'eu-west-1';
    expect(getRegion()).toEqual('eu-west-1');
  });

  it('should prefer AWS_REGION over AWS_DEFAULT_REGION', () => {
    process.env.AWS_REGION = 'ap-southeast-2';
    process.env.AWS_DEFAULT_REGION = 'eu-west-1';
    expect(getRegion()).toEqual('ap-southeast-2');
  });
});
