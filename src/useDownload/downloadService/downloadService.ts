import { BASE64_REG, GLOBAL_CONFIG } from './constants';

/**
 * 用于实现在浏览器下载文件
 *
 * @link https://github.dev/coddredd/react-files-hooks/blob/master/src/download-service/download.service.js
 */
class DownloadService {
  private mimeType: string;
  private fileName: string;
  private payload: string | Blob;
  private reader: FileReader;

  constructor() {
    this.mimeType = '';
    this.fileName = '';
    this.reader = new FileReader();
    this.payload = '';
  }

  public download(data: string | Blob, fileName: string, fileMimeType: string) {
    this.mimeType = fileMimeType;
    this.fileName = fileName;
    this.payload = data;

    if (this.isPayloadBase64()) {
      if (this.isBigBase64()) {
        this.convertBase64ToBlob();
      } else {
        this.saveBase64();
      }
    }
  }
  private saveBase64() {
    return new Promise<void>((resolve) => {
      if (navigator.msSaveBlob && typeof this.payload === 'string') {
        navigator.msSaveBlob(this.dataUrlToBlob(this.payload), this.fileName);
      } else {
        this.saveBlob();
      }

      resolve();
    });
  }

  private saveBlob() {
    const blob =
      this.payload instanceof Blob
        ? this.payload
        : new Blob([this.payload], { type: this.mimeType });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, this.fileName);
    }

    if (window.URL) {
      return this.save(window.URL.createObjectURL(blob));
    }
  }

  private save(url: string) {
    const anchor = document.createElement('a');
    if ('download' in anchor) {
      return this.saveByAnchor(anchor, url);
    }
  }

  private saveByAnchor(anchor: HTMLAnchorElement, url: string) {
    anchor.href = url;
    anchor.setAttribute('download', this.fileName);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url));
  }

  private convertBase64ToBlob() {
    if (typeof this.payload === 'string') {
      this.payload = this.dataUrlToBlob(this.payload);
      this.mimeType = this.payload.type || GLOBAL_CONFIG.DEFAULT_TYPE;
    }
  }

  private dataUrlToBlob(strUrl: string) {
    const parts = strUrl.split(/[:;,]/);
    const type = parts[1];
    const decoder = parts[2] === 'base64' ? atob : decodeURIComponent;
    const binData = decoder(parts.pop() || '');
    const mx = binData.length;
    const uiArr = new Uint8Array(mx);

    for (let index = 0; index < mx; index++) {
      uiArr[index] += binData.charCodeAt(index);
    }

    return new Blob([uiArr], { type });
  }

  private isPayloadBase64() {
    if (typeof this.payload === 'string') {
      return BASE64_REG.test(this.payload);
    }
    return false;
  }

  private isBigBase64() {
    return this.payload.length > GLOBAL_CONFIG.MAX_PAYLOAD_LENGTH;
  }
}

export default DownloadService;
