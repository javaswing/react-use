import { expect, jest } from '@jest/globals';
import DownloadService from '../../src/useDownload/downloadService';

describe('download service methods', () => {
  let downloadService: DownloadService;

  beforeAll(() => {
    downloadService = new DownloadService();
  });

  describe('download method', () => {
    let strFileName: string,
      strMimeType: string,
      base64: string,
      file: Blob,
      downloadMock: any,
      setAttributeMock: any,
      clickMock: any;

    beforeEach(() => {
      base64 = 'data:image/png;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD';
      file = new Blob(['data:image/png;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD'], { type: 'image/png' });
      strFileName = 'photo.png';
      strMimeType = 'image/png';
      downloadMock = jest.fn();
      setAttributeMock = jest.fn();
      clickMock = jest.fn();

      document.createElement = jest.fn<any>().mockImplementation(() => {
        return {
          download: downloadMock,
          setAttribute: setAttributeMock,
          style: {},
          click: clickMock,
        };
      });

      document.body.appendChild = jest.fn<any>();

      document.body.removeChild = jest.fn<any>();
    });

    it('should download photo (File) with URL and DOM element', (done) => {
      const revokeObjectURLMock = jest.fn();
      Object.defineProperty(window, 'URL', {
        value: { createObjectURL: () => 'url', revokeObjectURL: revokeObjectURLMock },
      });

      downloadService.download(file, strFileName, strMimeType);

      expect(setAttributeMock).toHaveBeenCalledWith('download', strFileName);
      setTimeout(() => {
        expect(clickMock).toHaveBeenCalledWith();
        expect(revokeObjectURLMock).toHaveBeenCalledWith('url');
        done();
      }, 400);
    });

    it('should download photo (base64) with URL and DOM element', (done) => {
      const revokeObjectURLMock = jest.fn();
      Object.defineProperty(window, 'URL', {
        value: { createObjectURL: () => 'url', revokeObjectURL: revokeObjectURLMock },
      });

      downloadService.download(base64, strFileName, strMimeType);

      expect(setAttributeMock).toHaveBeenCalledWith('download', strFileName);
      setTimeout(() => {
        expect(clickMock).toHaveBeenCalledWith();

        done();
      }, 400);
    });

    it('should download photo (File) with navigator msSaveBlob', () => {
      const msSaveBlobMock = jest.fn<(blob: any, defaultName?: string | undefined) => boolean>();
      navigator.msSaveBlob = msSaveBlobMock;

      downloadService.download(file, strFileName, strMimeType);
      expect(msSaveBlobMock).toHaveBeenCalledWith(file, strFileName);

      expect(setAttributeMock).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(clickMock).not.toHaveBeenCalledWith();
      });
    });

    it('should download photo (base64) with navigator msSaveBlob', () => {
      const msSaveBlobMock = jest.fn<(blob: any, defaultName?: string | undefined) => boolean>();
      navigator.msSaveBlob = msSaveBlobMock;

      downloadService.download(base64, strFileName, strMimeType);
      expect(msSaveBlobMock).toHaveBeenCalledWith(file, strFileName);

      expect(setAttributeMock).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(clickMock).not.toHaveBeenCalledWith();
      });
    });

    it('should download photo with iframe', (done) => {
      Object.defineProperty(window, 'navigator', { value: { userAgent: 'localhost://' } });
      const createElementMock = { setAttribute: setAttributeMock, style: {}, click: clickMock };
      document.createElement = jest.fn<any>().mockImplementation(() => createElementMock);

      downloadService.download(base64, strFileName, strMimeType);
      expect(document.createElement).toHaveBeenCalledWith('iframe');
      expect(document.body.appendChild).toHaveBeenCalledWith(createElementMock);
      expect(setAttributeMock).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(clickMock).not.toHaveBeenCalled();
        done();
      }, 400);
    });
  });
});
