const Bluebird = require('bluebird');

jest.mock('./get-batch-parameters', () => ({
  getBatchParameters: () => Promise.resolve(['OLD_WORLD', 'OLD_BAR', 'UNCHANGED'])
}));

const mockPutParameter = jest.fn(() => ({
  promise: () => Bluebird.resolve({ Version: 0 })
}));

const AWS = require('aws-sdk');
AWS.SSM.mockImplementation(function () {
  return {
    putParameter: mockPutParameter
  };
});

const mockOnComplete = jest.fn();

const { makeSsmStore } = require('./make-ssm-store');
const ssmStore = makeSsmStore();

describe('updateConfigs', () => {

  describe('when an onCompleteHook is provided', () => {
    beforeAll(() => {
      return ssmStore.updateConfigs({
        parameters: {
          'HELLO': 'WORLD',
          'FOO': 'BAR',
          'GREAT': 'UNCHANGED'
        },
        onComplete: mockOnComplete
      });
    })

    it('should update configs in ssm', () => {
      expect(mockPutParameter).toBeCalledWith({
        Name: 'HELLO',
        Overwrite: true,
        Type: 'String',
        Value: 'WORLD'
      });

      expect(mockPutParameter).toBeCalledWith({
        Name: 'FOO',
        Overwrite: true,
        Type: 'String',
        Value: 'BAR'
      });
    });

    it('should not update configs which have not changed', () => {
      expect(mockPutParameter).not.toBeCalledWith({
        Name: 'GREAT',
        Overwrite: true,
        Type: 'String',
        Value: 'UNCHANGED'
      });

      expect(mockPutParameter.mock.calls.length).toEqual(2);
    });

    it('should run onComplete hook for each parameter', () => {
      expect(mockOnComplete).toBeCalledWith({
        name: 'HELLO',
        value: 'WORLD',
        version: 0
      });

      expect(mockOnComplete).toBeCalledWith({
        name: 'FOO',
        value: 'BAR',
        version: 0
      });
    });
  });

  describe('when an onComplete hook is not provided', () => {
    it('should still persist the secret in ssm', () => {
      mockPutParameter.mockClear();

      expect.assertions(1);

      return ssmStore.updateConfigs({
        parameters: {
          'HELLO': 'WORLD'
        }
      })
      .then(() => {
        expect(mockPutParameter).toBeCalledWith({
          Name: 'HELLO',
          Overwrite: true,
          Type: 'String',
          Value: 'WORLD'
        });
      });
    });
  });
});
