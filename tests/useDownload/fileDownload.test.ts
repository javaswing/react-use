import { expect, jest } from '@jest/globals';
import { fileDownload } from '../../src/useDownload/utils/fileDownload';

describe('fileDownload method', () => {
  let strFileName: string,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    strMimeType: string,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // @ts-ignore
    document.createElement = jest.fn().mockImplementation(() => {
      return {
        download: downloadMock,
        setAttribute: setAttributeMock,
        style: {},
        click: clickMock,
      };
    });
    // @ts-ignore
    document.body.appendChild = jest.fn();
    // @ts-ignore
    document.body.removeChild = jest.fn();
  });

  it('should download photo (File) with URL and DOM element', (done) => {
    const revokeObjectURLMock = jest.fn();
    Object.defineProperty(window, 'URL', {
      value: { createObjectURL: () => 'url', revokeObjectURL: revokeObjectURLMock },
    });

    fileDownload(file, strFileName);

    expect(setAttributeMock).toHaveBeenCalledWith('download', strFileName);
    setTimeout(() => {
      expect(clickMock).toHaveBeenCalledWith();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('url');
      done();
    }, 400);
  });
});
