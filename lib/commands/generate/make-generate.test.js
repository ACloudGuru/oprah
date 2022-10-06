const { dump } = require('js-yaml');

const mockWriteFile = jest.fn();
const mockExists = jest.fn();

jest.mock('fs', () => ({
  writeFile: mockWriteFile,
  existsSync: mockExists
}));

const { makeGenerate, defaultConfig } = require('./make-generate');

describe('make generate', () => {
  describe('when file exists', () => {
    it('throws an error', async () => {
      mockExists.mockReturnValueOnce(true);
      const generate = makeGenerate();
      await expect(generate).rejects.toThrow(
        `oprah.yml file already exists in the following directory -- ${process.cwd()}`
      );
    });
  });

  describe('when file doesnt exist', () => {
    it('generates file', async () => {
      mockExists.mockReturnValueOnce(false);
      const generate = makeGenerate();
      await generate();
      expect(mockWriteFile).toHaveBeenCalledWith(
        'oprah.yml',
        dump(defaultConfig),
        expect.any(Function)
      );
    });
  });
});
