export function fileDownload(blob: Blob, fileName: string) {
  const anchor = document.createElement('a');
  try {
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url));
  } catch (error) {
    throw new Error(`[useDownload]: ${error as Error}.message`);
  }
}
