const api = require('../../lib/api.js');

let mockRequestSpy;

jest.mock('request-promise', () => ({
  get: (argv) =>
    new Promise((resolve) => {
      mockRequestSpy(argv, 'get');
      resolve(argv);
    }),
  post: (argv) =>
    new Promise((resolve) => {
      mockRequestSpy(argv, 'post');
      resolve(argv);
    }),
}));

jest.mock('fs', () => ({
  createReadStream: (path) => path,
}));

describe('lib/api', () => {
  let apiInstance;

  beforeEach(() => {
    mockRequestSpy = jest.fn();
    apiInstance = api({
      projectIdentifier: 'some',
      apiKey: '123',
      basePath: '/some',
    });
  });

  describe('crowdinLanguages', () => {
    beforeEach(async () => {
      await apiInstance.crowdinLanguages();
    });

    it('should call the proper crowdin url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.crowdin.com/api/supported-languages?json=true',
        }),
        'get',
      );
    });

    it('should cache the call', async () => {
      expect(mockRequestSpy).not.toHaveBeenCalled();
    });
  });

  describe('getProjectInfo', () => {
    beforeEach(async () => {
      await apiInstance.getProjectInfo();
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/info?key=123&json=true',
        }),
        'post',
      );
    });
  });

  describe('availableLanguages', () => {
    let res;

    beforeEach(async () => {
      jest.spyOn(apiInstance, 'getProjectInfo').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve({
              languages: [{ code: 'es' }, { code: 'en' }],
            });
          }),
      );

      res = await apiInstance.availableLanguages();
    });

    it('should return the language codes', () => {
      expect(res).toEqual(['es', 'en']);
    });
  });

  describe('availableBranches', () => {
    let res;

    beforeEach(async () => {
      jest.spyOn(apiInstance, 'getProjectInfo').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve({
              files: [
                { node_type: 'branch', name: 'one_branch' },
                { node_type: 'other', name: 'other node' },
              ],
            });
          }),
      );

      res = await apiInstance.availableBranches();
    });

    it('should return the branch names', () => {
      expect(res).toEqual(['one_branch']);
    });
  });

  describe('languageStatus', () => {
    beforeEach(async () => {
      await apiInstance.languageStatus('es');
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/language-status?key=123&json=true&language=es',
        }),
        'post',
      );
    });
  });

  describe('deleteBranch', () => {
    beforeEach(async () => {
      await apiInstance.deleteBranch('some_branch');
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/delete-directory?key=123&json=true&name=%2F&branch=some_branch',
        }),
        'post',
      );
    });

    describe('with dry run', () => {
      beforeEach(async () => {
        mockRequestSpy = jest.fn();
        apiInstance = api({
          projectIdentifier: 'some',
          apiKey: '123',
          basePath: '/some',
          dryRun: true,
        });
        await apiInstance.deleteBranch('some_branch');
      });

      it('should should not perform the request', () => {
        expect(mockRequestSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('createBranch', () => {
    beforeEach(async () => {
      await apiInstance.createBranch('some_branch');
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/add-directory?key=123&json=true&name=some_branch&is_branch=1',
        }),
        'post',
      );
    });
  });

  describe('addFile', () => {
    const fileConfig = {
      source: './path/some-file.txt',
      translation: 'es',
    };

    it('should send the file to the proper url', async () => {
      await apiInstance.addFile(fileConfig, 'some-branch');
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/add-file?key=123&json=true&branch=some-branch',
          formData: expect.objectContaining({
            'export_patterns[./path/some-file.txt]': '/es',
          }),
        }),
        'post',
      );
    });
  });

  describe('updateFile', () => {
    const fileConfig = {
      source: './path/some-file.txt',
      translation: 'es',
    };

    beforeEach(async () => {
      await apiInstance.updateFile(fileConfig, 'some-branch');
    });

    it('should send the file to the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/update-file?key=123&json=true&branch=some-branch',
          formData: expect.objectContaining({
            'export_patterns[./path/some-file.txt]': '/es',
          }),
        }),
        'post',
      );
    });
  });

  describe('uploadTranslations', () => {
    beforeEach(async () => {
      await apiInstance.uploadTranslations('es', [
        './path/some-file.txt',
        './path/other-file.txt',
      ]);
    });

    it('should send the files to the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/upload-translation?key=123&json=true&language=es',
          formData: expect.objectContaining({
            'files[0]': '/some/path/some-file.txt',
            'files[1]': '/some/path/other-file.txt',
          }),
        }),
        'post',
      );
    });
  });

  describe('buildTranslations', () => {
    beforeEach(async () => {
      await apiInstance.buildTranslations('some-branch');
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/export?key=123&json=true&branch=some-branch',
        }),
        'post',
      );
    });
  });

  describe('createDir', () => {
    beforeEach(async () => {
      await apiInstance.createDir('some-name', 'some-branch');
    });

    it('should call the proper url', () => {
      expect(mockRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uri:
            'https://api.crowdin.com/api/project/some/add-directory?key=123&json=true&name=some-name&recursive=1&branch=some-branch',
        }),
        'post',
      );
    });
  });

  describe('getDownloadTranslationUrl', () => {
    it('should return a proper download translation url', () => {
      expect(
        apiInstance.getDownloadTranslationUrl('some-branch', 'es', 'some-file'),
      ).toEqual(
        'https://api.crowdin.com/api/project/some/export-file?key=123&language=es&file=some-file&branch=some-branch',
      );
    });
  });
});
