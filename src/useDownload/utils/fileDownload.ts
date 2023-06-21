export function fileDownload(blob: Blob, fileName: string) {
  const aDom = document.createElement('a');
  try {
    const url = URL.createObjectURL(blob);
    aDom.href = url;
    aDom.download = fileName;
    document.body.appendChild(aDom);
    aDom.click();
    document.body.removeChild(aDom);
    setTimeout(() => URL.revokeObjectURL(url));
  } catch (error) {
    throw new Error(`[useDownload]: ${error as Error}.message`);
  }
}
