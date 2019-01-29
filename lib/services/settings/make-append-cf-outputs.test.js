const { makeAppendCfOutputs } = require('./make-append-cf-outputs');

describe('appendCfOutputs', () => {
  it('should append cfOutputs to the settings if cfOuputs is provided', () => {
    const appendCfOutputs = makeAppendCfOutputs({
      cfService: {
        getOutputs: jest.fn(() => Promise.resolve({
          output1: 'output1',
          output2: 'output2'
        }))
      }
    });

    const settings = {
      service: 'the-test',
      cfOutputs: ['stack1', 'stack2']
    };

    expect.assertions(1);

    return appendCfOutputs(settings)
    .then(updatedSettings => {
      expect(updatedSettings).toEqual({
        service: 'the-test',
        cfOutputs: ['stack1', 'stack2'],
        outputs: {
          output1: 'output1',
          output2: 'output2'
        }
      })
    });
  });

  it('should do nothing if cfOuputs is not provided in the settings', () => {
    const appendCfOutputs = makeAppendCfOutputs({
      cfService: {
        getOutputs: jest.fn(() => Promise.resolve({
          output1: 'output1',
          output2: 'output2'
        }))
      }
    });

    const settings = {
      service: 'the-test'
    };

    expect.assertions(1);

    return appendCfOutputs(settings)
    .then(updatedSettings => {
      expect(updatedSettings).toEqual({
        service: 'the-test'
      })
    });
  });
});