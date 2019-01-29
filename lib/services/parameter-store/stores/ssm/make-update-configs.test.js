const Bluebird = require('bluebird');

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

const { makeUpdateConfigs } = require('./make-update-configs');

describe('updateConfigs', () => {

  describe('when an onCompleteHook is provided', () => {
    beforeAll(() => {
      const updateConfigs =  makeUpdateConfigs();
      return updateConfigs({
        parameters: {
          'HELLO': 'WORLD',
          'FOO': 'BAR'
        },
        onComplete: mockOnComplete
      });
    })

    it('should update configs in ssm', () => {
      expect(mockPutParameter.mock.calls[0][0]).toEqual({
        Name: 'HELLO',
        Overwrite: true,
        Type: 'String',
        Value: 'WORLD'
      });

      expect(mockPutParameter.mock.calls[1][0]).toEqual({
        Name: 'FOO',
        Overwrite: true,
        Type: 'String',
        Value: 'BAR'
      });
    });

    it('should run onComplete hook for each parameter', () => {
      expect(mockOnComplete.mock.calls[0][0]).toEqual({
        name: 'HELLO',
        value: 'WORLD',
        version: 0
      });

      expect(mockOnComplete.mock.calls[1][0]).toEqual({
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

      const updateConfigs =  makeUpdateConfigs();
      return updateConfigs({
        parameters: {
          'HELLO': 'WORLD'
        }
      })
      .then(() => {
        expect(mockPutParameter.mock.calls[0][0]).toEqual({
          Name: 'HELLO',
          Overwrite: true,
          Type: 'String',
          Value: 'WORLD'
        });
      });
    });
  });
});
