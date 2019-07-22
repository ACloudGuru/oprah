const mockPromptForValues = jest.fn().mockResolvedValue('promptForValues');

jest.mock('./prompt-for-values', () => ({
  promptForValues: mockPromptForValues
}));

const mockValidateExistingValues = jest.fn().mockResolvedValue('validate');

jest.mock('./validate-existing-values', () => ({
  validateExistingValues: mockValidateExistingValues
}));

const mockGetParameters = jest.fn();

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
    mockGetParameters.mockResolvedValue({
      B: 'BAR',
      D: 'DOG'
    });

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
    const currentValues = {
      B: 'BAR',
      D: 'DOG'
    };

    mockGetParameters.mockResolvedValue(currentValues);

    expect.assertions(3);

    return promptRequiredConfigs({
      parameterNames: ['B', 'D'],
      required: {
        B: 'desc',
        C: 'desc'
      },
      interactive: false
    })
    .then(res => {
      expect(res).toEqual('validate');
      expect(mockValidateExistingValues.mock.calls[0][0]).toEqual({
        currentValues,
        requiredValues: {
          B: 'desc',
          C: 'desc'
        }
      });
      expect(mockPromptForValues.mock.calls.length).toEqual(0);
    });
  });

  it('should prompt for all required values if in interactive mode', () => {
    const currentValues = {
      B: 'BAR',
      D: 'DOG'
    };
    const requiredValues = {
      A: 'desc',
      MERRY: 'desc'
    };

    mockGetParameters.mockResolvedValue(currentValues);

    expect.assertions(2);

    return promptRequiredConfigs({
      parameterNames: ['B', 'D'],
      required: requiredValues,
      interactive: true
    })
    .then(res => {
      expect(res).toEqual('promptForValues');
      expect(mockPromptForValues.mock.calls[0][0]).toEqual({
        currentValues,
        requiredValues
      });
    });
  });

  it('should prompt for all missing values if in interactive mode and missing only mode', () => {
    const currentValues = {
      A: 'APPLE',
      D: 'DOG'
    };

    mockGetParameters.mockResolvedValue(currentValues);

    expect.assertions(2);

    return promptRequiredConfigs({
      parameterNames: ['A', 'D'],
      required: {
        A: 'desc',
        C: 'desc',
        E: 'desc'
      },
      interactive: true,
      missingOnly: true
    })
    .then(res => {
      expect(res).toEqual('promptForValues');
      expect(mockPromptForValues.mock.calls[0][0]).toEqual({
        currentValues: {},
        requiredValues: {
          C: 'desc',
          E: 'desc'
        }
      });
    });
  });

  it('should populate standard values when required is not provided', () => {
    const currentValues = {
      A: 'APPLE',
      D: 'DOG'
    };

    mockGetParameters.mockResolvedValue(currentValues);

    expect.assertions(2);

    return promptRequiredConfigs({
      parameterNames: ['A', 'D'],
      interactive: true,
      missingOnly: true
    })
    .then(res => {
      expect(res).toEqual('promptForValues');
      expect(mockPromptForValues.mock.calls[0][0]).toEqual({
        currentValues: {},
        requiredValues: {}
      });
    });
  });
});

