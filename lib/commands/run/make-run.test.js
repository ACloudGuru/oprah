const mockPromptRequiredConfigs = jest.fn(() => Promise.resolve());
const mockUpdateSecrets = jest.fn(() => Promise.resolve());
const mockUpdateConfigs = jest.fn(() => Promise.resolve());

jest.mock('./make-prompt-required-configs', () => ({
  makePromptRequiredConfigs: () => mockPromptRequiredConfigs
}));

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    updateSecrets: mockUpdateSecrets,
    updateConfigs: mockUpdateConfigs
  })
}))

const path = require('path');

const { makeOprah } = require('../../makeOprah');

describe('run', () => {
  let promise;

  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../examples/ssm-provider.yml')
  });

  beforeAll(() => {
    promise = oprah.run();
  });


  it('should prompt users for config if required', () => {
    return promise
    .then(() => {
      expect(mockPromptRequiredConfigs.mock.calls[0][0]).toEqual({
        interactive: false,
        parameterNames: [
          '/testing/oprah/config/DB_NAME',
          '/testing/oprah/config/DB_HOST',
          '/testing/oprah/config/DB_TABLE'
        ],
        required: {
          DB_TABLE: 'some database table name for testing'
        }
      });
    })
  });

  it('should prompt users for secrets if required', () => {

  });

  it('should update the parameter store with the merged config from the prompt and parameter store', () => {

  });

  it('should update the parameter store with the merged config from the prompt and parameter store', () => {

  });
});
