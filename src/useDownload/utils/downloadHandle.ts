import { fileDownload } from './fileDownload';

export const downloadHandle = async (
  response: Response | Blob,
  ext = '',
  fileName: string = document.title
) => {
  let blobData: Blob;
  let downloadFileName = fileName;
  if (response instanceof Blob) {
    blobData = response;
    if (blobData.size === 0) {
      throw new Error('下载数据为空');
    }
  } else {
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches !== null && matches[1]) {
        downloadFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    blobData = await response.clone().blob();
  }

  fileDownload(blobData, downloadFileName + ext);
};
