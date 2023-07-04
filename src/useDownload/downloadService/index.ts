import { GLOBAL_CONFIG } from './constants';

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
  reader: FileReader;

  constructor() {
    this.mimeType = '';
    this.fileName = '';
    this.payload = '';
    this.reader = new FileReader();
  }

  public async download(data: PayloadType, fileName: string, fileMimeType: string) {
    this.mimeType = fileMimeType;
    this.fileName = fileName;
    this.payload = data;

    if (this.isPayloadBase64(this.payload)) {
      if (this.isBigBase64()) {
        this.convertBase64ToBlob();
      } else {
        await this.saveBase64(this.payload);
      }
    } else {
      await this.saveBlob(this.payload);
    }
  }

  private async saveBase64(blob: string) {
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(this.dataUrlToBlob(blob), this.fileName);
    } else {
      await this.saveBlob(blob);
    }
  }

  private async saveBlob(payload: PayloadType) {
    const b = payload instanceof Blob ? payload : this.dataUrlToBlob(payload);

    // IE10+ support
    // https://learn.microsoft.com/en-us/previous-versions/hh772331(v=vs.85)
    if (navigator.msSaveBlob) {
      return navigator.msSaveBlob(b, this.fileName);
    }
    if (window.URL) {
      return this.save(window.URL.createObjectURL(b));
    } else {
      if (this.isStringPayload(b)) {
        return this.saveBigBase64(b);
      } else {
        return this.convertByFileReader(b).then((b) => typeof b === 'string' && this.save(b));
      }
    }
  }

  async convertByFileReader(b: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
      this.reader.onload = () => this.reader.result && resolve(this.reader.result);
      this.reader.readAsDataURL(b);
    });
  }

  saveBigBase64(blob: string) {
    try {
      return this.save('data:' + this.mimeType + ';base64,' + window.btoa(blob));
    } catch (error) {
      return this.save('data:' + this.mimeType + ',' + encodeURIComponent(blob));
    }
  }

  /**
   * 核心保存方法
   * @param url
   * @returns
   * 1. 通过A标签进行保存
   * 2. 检测如果是safari进行特殊处理
   * 3. 通过iframe进行保存
   */
  private save(url: string) {
    const anchor = document.createElement('a');
    if ('download' in anchor) {
      return this.saveByAnchor(anchor, url);
    }
    if (this.isSafari()) {
      return this.saveByLocationSafari(url);
    }
    this.saveByIframe(url);
  }

  private saveByLocationSafari(url: string) {
    const urlWithoutBase64 = url.replace(GLOBAL_CONFIG.BASE_64_REGEX, GLOBAL_CONFIG.DEFAULT_TYPE);
    if (!window.open(urlWithoutBase64)) {
      if (window.confirm(GLOBAL_CONFIG.CONFIRM_TEXT)) {
        window.location.href = urlWithoutBase64;
      }
    }
    return true;
  }

  private saveByIframe(url: string) {
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

  public dataUrlToBlob(strUrl: string) {
    const parts = strUrl.split(/[:;,]/);
    const type = parts[1];
    const decoder = parts[2] === 'base64' ? atob : decodeURIComponent;
    const binData = decoder(parts.pop() || '');
    const length = binData.length;

    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    for (let index = 0; index < length; index++) {
      arr[index] = binData.charCodeAt(index);
    }
    return new Blob([buf], { type });
  }

  private isPayloadBase64(payload: PayloadType): payload is string {
    if (this.isStringPayload(payload)) {
      return GLOBAL_CONFIG.FULL_BASE_64_REGEX.test(payload);
    }
    return false;
  }

  private isBigBase64() {
    return this.payload.length > GLOBAL_CONFIG.MAX_PAYLOAD_LENGTH;
  }

  private isStringPayload(payload: PayloadType): payload is string {
    return typeof payload === 'string';
  }

  isSafari() {
    return GLOBAL_CONFIG.SAFARI_REGEX.test(navigator.userAgent);
  }
}

export default DownloadService;
