import { useCallback, useState } from 'react';
import DownloadService from './downloadService';
import { GLOBAL_CONFIG } from './downloadService/constants';

type OptionsType = {
  downloadFileName?: string;
  mimeType?: string;
};

type SourceType = string | Blob;

/**
 * 有以下几种情况：
 * 1. 传入的直接是一个url或者base64
 * 2. 传入的是一个Blob对象
 *
 *
 * @description 功能列表
 * 1. 支持调用函数
 * 2. 支持进度显示
 * 3. 支持loading状态显示
 */

const downloadService = new DownloadService();

function useDownLoad(source: SourceType, options: OptionsType = {}) {
  // const abortRef = useRef<AbortController>();
  const [loading, setLoading] = useState(false);

  const { downloadFileName = 'file', mimeType = 'text/plain' } = options;

  const run = useCallback(async () => {
    // abortRef.current = new AbortController();
    if (loading) return;
    setLoading(true);

    try {
      if (typeof source === 'string') {
        if (GLOBAL_CONFIG.FULL_BASE_64_REGEX.test(source)) {
          // base64
          await downloadService.download(source, downloadFileName, mimeType);
        } else {
          let fileName = downloadFileName;
          let blobData: Blob;
          fetch(source).then(async (res) => {
            if (res.headers.get('content-disposition')) {
              // stream
              const disposition = res.headers.get('content-disposition');
              if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches !== null && matches[1]) {
                  fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
              }
            }
            blobData = await res.clone().blob();
            await downloadService.download(blobData, fileName, mimeType);
          });
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [downloadFileName, loading, mimeType, source]);

  return { loading, run: run };
}

export default useDownLoad;
