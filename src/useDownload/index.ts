import { useCallback, useRef, useState } from 'react';
import { fileDownload } from './utils/fileDownload';
import { randomString } from './utils/util';

type Service = (...args: unknown[]) => Promise<unknown>;

type OptionsType = {
  downloadFileName?: string;
  downloadExt?: string;
};

type SourceType = string | Service;

/**
 * 有以下几种情况：
 * 1. 传入的直接是一个url
 * 2. 传入一个promise请求
 *    - promise 最终返回url地址
 *    - promise 返回的是一个文件流
 *
 *
 * @description 功能列表
 * 1. 支持调用，取消函数
 * 2. 支持进度显示
 * 3. 支持loading状态显示
 */

function useDownLoad(source: SourceType, options: OptionsType) {
  const abortRef = useRef<AbortController>();
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    abortRef.current = new AbortController();
    if (loading) return;
    setLoading(true);
    let asyncRes: Promise<Response> | Promise<unknown>;
    let fileName = randomString(10) + options?.downloadExt;
    let blobData: Blob;

    // 请求URL
    if (typeof source === 'string') {
      asyncRes = fetch(source, { signal: abortRef.current?.signal });
    } else {
      asyncRes = source.call(null, { signal: abortRef.current?.signal });
    }
    asyncRes
      .then(async (res) => {
        if (res instanceof Response) {
          const type = res.headers.get('Content-Type') || 'text/plain';
          const ext = type.split('/').pop()!;
          const extension = ext === 'plain' ? 'txt' : ext;
          fileName = randomString(10) + extension;
          blobData = await res.clone().blob();

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
            blobData = await res.clone().blob();
          }
        } else {
          console.log('res', res);
        }
        fileDownload(blobData, fileName);
      })
      .catch((error: Error) => {
        console.error('useDownLoad error', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading, options?.downloadExt, source]);

  return { loading, run: run, abort: abortRef.current?.abort };
}

export default useDownLoad;
