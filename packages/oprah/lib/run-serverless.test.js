'use strict';


const mockExeca = jest.fn(() => Promise.resolve('Finished running serverless'));

jest.mock('execa', () => mockExeca);

const { runServerless } = require('./run-serverless');

describe('#runServerless', () => {

  it('should throw an error if serverlessYamlDirectory is not provided', () => {
    return expect(runServerless({}))
    .rejects.toThrow('serverlessYamlDirectory is required');
  });

  it('should throw an error is stage is not provided', () => {
    return expect(runServerless({
      serverlessYamlDirectory: './fakeFolder',
    }))
    .rejects.toThrow('stage is required');
  });

  it('should throw an error if the file does not exists', () => {
    return expect(runServerless({
      serverlessYamlDirectory: './fakeFolder',
      stage: 'some-stage'
    }))
    .rejects.toThrow('Could not find serverless.yml');
  });


  it('should execute deploy if the serverless file exists', () => {
    return runServerless({
      serverlessYamlDirectory: './mocks',
      stage: 'test-auto'
    })
    .then(() => {
      expect(mockExeca.mock.calls[0][0]).toEqual('serverless');
      expect(mockExeca.mock.calls[0][1]).toEqual(['info', '--stage', 'test-auto']);
      expect(mockExeca.mock.calls[0][2]).toEqual({
        cwd: './mocks'
      });
    });
  });
});
