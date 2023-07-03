export const GLOBAL_CONFIG = {
  DEFAULT_FILE_NAME: 'file',
  DEFAULT_TYPE: 'application/json',
  MAX_PAYLOAD_LENGTH: 1024 * 1024 * 1.999,
  SAFARI_REGEX: /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//,
  BASE_64_REGEX: /^data:([\w]+)/,
  FULL_BASE_64_REGEX: /^data:[\w+]+\/[\w+]+[,;]/,
  CONFIRM_TEXT:
    'Displaying New Document\n\nUse "Save As..." to download, then click back to return to this page.',
};
