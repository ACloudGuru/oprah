const { makeDdbStore } = require('./make-ddb-store');

describe('makeDdbStore', () => {
  it('should make an instance of ddb store', () => {
    const ddbStore = makeDdbStore({ tableName: 'theTable' });

    expect(ddbStore).toHaveProperty('getAllParameters');
    expect(ddbStore).toHaveProperty('updateConfigs');
    expect(ddbStore).toHaveProperty('updateSecrets');
  });
});