const api = require('../../lib/api');

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

describe('lib/api', () => {
  beforeEach(() => {
    mockRequestSpy = jest.fn();
  });

  describe('crowdinLanguages', () => {
    beforeEach(async () => {
      await api({
        projectIdentifier: 'some',
        apiKey: '123',
      }).crowdinLanguages();
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
      await api({
        projectIdentifier: 'some',
        apiKey: '123',
      }).getProjectInfo();
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
});
