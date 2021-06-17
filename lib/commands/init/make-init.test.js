const path = require('path');

const mockDeploy = jest.fn(() => Promise.resolve());

const { makeOprah } = require('../../make-oprah');

describe('init', () => {
  describe('when the provider is ssm', () => {
    it('should do nothing', () => {
      const oprah = makeOprah({
        stage: 'testing',
        config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
      });

      expect.assertions(1);

      return oprah.init().then(() => {
        expect(mockDeploy.mock.calls.length).toEqual(0);
      });
    });
  });
});
