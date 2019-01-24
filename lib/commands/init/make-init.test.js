const path = require('path');

const mockDeploy = jest.fn(() => Promise.resolve());

jest.mock('../../services/cf/deploy', () => ({
  deploy: mockDeploy
}));

const { makeOprah } = require('../../makeOprah');

describe('init', () => {
  beforeEach(() => {
    mockDeploy.mockClear();
  })

  describe('when the provider is ssm', () => {
    it('should do nothing', () => {
      const oprah = makeOprah({
        stage: 'testing',
        config: path.resolve(__dirname, '../../../examples/ssm-provider.yml')
      });

      expect.assertions(1);

      return oprah.init()
      .then(() => {
        expect(mockDeploy.mock.calls.length).toEqual(0);
      });
    });
  });

  describe('when the provider is ddb', () => {
    it('should create a dynamodb table based on the settings', () => {
      const oprah = makeOprah({
        stage: 'testing',
        config: path.resolve(__dirname, '../../../examples/dynamodb-provider.yml')
      });

      expect.assertions(1);

      return oprah.init()
      .then(() => {
        expect(mockDeploy.mock.calls[0][0]).toEqual({
          name: 'oprah-test-table-name',
          params: {
            TableName: 'oprah-test-table-name'
          },
          template: path.resolve(__dirname, '../../../cf-templates/dynamodb.yml')
        });
      })
    });
  });
});