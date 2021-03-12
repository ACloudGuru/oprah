const mockPromptRequiredConfigs = jest.fn(() => Promise.resolve());
const mockUpdateSecrets = jest.fn(() => Promise.resolve());
const mockUpdateConfigs = jest.fn(() => Promise.resolve());
const AWS = require('aws-sdk');

AWS.CloudFormation.mockImplementation(() => ({
  describeStacks: jest.fn(() => ({
    promise: () =>
      Promise.resolve({
        Stacks: [
          {
            Outputs: [
              {
                OutputKey: 'OprahDomain',
                OutputValue: 'oprah.acloud.guru'
              }
            ]
          }
        ]
      })
  }))
}));

mockPromptRequiredConfigs
  .mockImplementationOnce(() =>
    Promise.resolve({
      config1: '1',
      config2: '2'
    })
  )
  .mockImplementationOnce(() =>
    Promise.resolve({
      secret1: '1'
    })
  );

jest.mock('./make-prompt-required-configs', () => ({
  makePromptRequiredConfigs: () => mockPromptRequiredConfigs
}));

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    updateSecrets: mockUpdateSecrets,
    updateConfigs: mockUpdateConfigs
  })
}));

const path = require('path');

const { makeOprah } = require('../../make-oprah');

describe('run', () => {
  let promise;

  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
  });

  beforeAll(() => {
    promise = oprah.run();
  });

  it('should prompt users for config if required', () =>
    promise.then(() => {
      expect(mockPromptRequiredConfigs.mock.calls[0][0]).toEqual({
        interactive: false,
        missingOnly: false,
        parameterNames: [
          '/testing/oprah/config/DB_NAME',
          '/testing/oprah/config/DB_HOST',
          '/testing/oprah/config/DB_TABLE'
        ],
        required: {
          DB_TABLE: 'some database table name for testing'
        }
      });
    }));

  it('should prompt users for secrets if required', () =>
    promise.then(() => {
      expect(mockPromptRequiredConfigs.mock.calls[1][0]).toEqual({
        interactive: false,
        missingOnly: false,
        parameterNames: ['/testing/oprah/secret/DB_PASSWORD'],
        required: {
          DB_PASSWORD: 'secret database password'
        }
      });
    }));

  it('should update the parameter store with the merged config from the prompt and parameter store', () =>
    promise.then(() => {
      expect(mockUpdateConfigs.mock.calls[0][0]).toEqual({
        parameters: {
          '/testing/oprah/config/DB_HOST': '3200',
          '/testing/oprah/config/DB_NAME': 'my-database',
          '/testing/oprah/config/config1': '1',
          '/testing/oprah/config/config2': '2',
          '/testing/oprah/config/OprahDomain': 'oprah.acloud.guru'
        }
      });
    }));

  it('should update the parameter store with the secrets from the prompt', () =>
    promise.then(() => {
      expect(mockUpdateSecrets.mock.calls[0][0]).toEqual({
        parameters: {
          '/testing/oprah/secret/secret1': '1'
        }
      });
    }));
});
