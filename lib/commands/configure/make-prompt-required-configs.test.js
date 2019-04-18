const mockPromptForValues = jest.fn().mockResolvedValue('promptForValues');

jest.mock('./prompt-for-values', () => ({
  promptForValues: mockPromptForValues
}));

const mockValidateExistingValues = jest.fn().mockResolvedValue('validate');

jest.mock('./validate-existing-values', () => ({
  validateExistingValues: mockValidateExistingValues
}));

const mockGetParameters = jest.fn(() => Promise.resolve({
  FOO: 'BAR',
  MERRY: 'CHRISTMAS'
}));

const { makePromptRequiredConfigs } = require('./make-prompt-required-configs');

const promptRequiredConfigs = makePromptRequiredConfigs({
  parameterStore: {
    getParameters: mockGetParameters
  }
});

describe('promptRequiredConfigs', () => {
  beforeEach(() => {
    mockPromptForValues.mockClear();
    mockValidateExistingValues.mockClear();
    mockGetParameters.mockClear();
  });

  it('should get all requested parameter names', () => {
    expect.assertions(1);

    return promptRequiredConfigs({
      parameterNames: ['B', 'D'],
      required: {},
      interactive: true
    })
    .then(() => {
      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        parameterNames: ['B', 'D']
      })
    })
  });

  it('should validate existing config if it is not in interactive mode', () => {
    expect.assertions(3);

    return promptRequiredConfigs({
      parameterNames: ['B', 'D'],
      required: {
        A: 'desc',
        MERRY: 'desc'
      },
      interactive: false
    })
    .then(res => {
      expect(res).toEqual('validate');
      expect(mockValidateExistingValues.mock.calls[0][0]).toEqual({
        currentValues: {
          FOO: 'BAR',
          MERRY: 'CHRISTMAS'
        },
        requiredValues: {
          A: 'desc',
          MERRY: 'desc'
        }
      });
      expect(mockPromptForValues.mock.calls.length).toEqual(0);
    });
  });

  it('should prompt for all required values if in interactive mode', () => {
    expect.assertions(2);

    return promptRequiredConfigs({
      parameterNames: ['B', 'D'],
      required: {
        A: 'desc',
        MERRY: 'desc'
      },
      interactive: true
    })
    .then(res => {
      expect(res).toEqual('promptForValues');
      expect(mockPromptForValues.mock.calls[0][0]).toEqual({
        currentValues: {
          FOO: 'BAR',
          MERRY: 'CHRISTMAS'
        },
        requiredValues: {
          A: 'desc',
          MERRY: 'desc'
        }
      });
    });
  });
});

