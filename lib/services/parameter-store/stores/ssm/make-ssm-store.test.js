const { makeSsmStore } = require('./make-ssm-store');

describe('makeSsmStore', () => {
  it('should make an instance of ssm store', () => {
    const ssmStore = makeSsmStore({ tableName: 'theTable' });

    expect(ssmStore).toHaveProperty('getAllParameters');
    expect(ssmStore).toHaveProperty('updateConfigs');
    expect(ssmStore).toHaveProperty('updateSecrets');
  });
});