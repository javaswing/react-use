import { BASE64_REG, GLOBAL_CONFIG } from './constants';

type PayloadType = string | Blob;

/**
 * 用于实现在浏览器下载文件
 *
 * @link https://github.dev/coddredd/react-files-hooks/blob/master/src/download-service/download.service.js
 */
class DownloadService {
  private mimeType: string;
  private fileName: string;
  private payload: PayloadType;

  constructor() {
    this.mimeType = '';
    this.fileName = '';
    this.payload = '';
  }

  public download(data: PayloadType, fileName: string, fileMimeType: string) {
    this.mimeType = fileMimeType;
    this.fileName = fileName;
    this.payload = data;

    if (this.isPayloadBase64(this.payload)) {
      if (this.isBigBase64()) {
        this.convertBase64ToBlob();
      } else {
        this.saveBase64(this.payload);
      }
    } else {
      this.saveBlob(this.payload);
    }
  }

  private saveBase64(blob: string) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(this.dataUrlToBlob(blob), this.fileName);
    } else {
      this.saveBlob(blob);
    }
  }

  private saveBlob(payload: PayloadType) {
    const blob = payload instanceof Blob ? payload : new Blob([payload], { type: this.mimeType });

    // IE10+ support
    // https://learn.microsoft.com/en-us/previous-versions/hh772331(v=vs.85)
    if (navigator.msSaveBlob) {
      return navigator.msSaveBlob(blob, this.fileName);
    }

    if (window.URL) {
      return this.save(window.URL.createObjectURL(blob));
    } else {
      if (this.isStringPayload(blob)) {
        return this.saveBigBase64(blob);
      }
    }
  }
  saveBigBase64(blob: string) {
    try {
      return this.save('data:' + this.mimeType + ';base64,' + window.btoa(blob));
    } catch (error) {
      return this.save('data:' + this.mimeType + ',' + encodeURIComponent(blob));
    }
  }

  private save(url: string) {
    const anchor = document.createElement('a');
    if ('download' in anchor) {
      return this.saveByAnchor(anchor, url);
    }
    this.saveByIframe(url);
  }

  saveByIframe(url: string) {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.src = url;
    setTimeout(() => document.body.removeChild(iframe), 333);
  }

  /**
   * 通过模拟a标签下载
   * @param anchor
   * @param url
   */
  private saveByAnchor(anchor: HTMLAnchorElement, url: string) {
    anchor.href = url;
    anchor.setAttribute('download', this.fileName);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 66);
  }

  private convertBase64ToBlob() {
    if (this.isStringPayload(this.payload)) {
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

  private isPayloadBase64(payload: PayloadType): payload is string {
    if (this.isStringPayload(payload)) {
      return BASE64_REG.test(payload);
    }
    return false;
  }

  private isBigBase64() {
    return this.payload.length > GLOBAL_CONFIG.MAX_PAYLOAD_LENGTH;
  }

  private isStringPayload(payload: PayloadType): payload is string {
    return typeof payload === 'string';
  }
}

export default DownloadService;
