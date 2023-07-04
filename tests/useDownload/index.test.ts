import useDownLoad from '../../src/useDownload';
import { renderHook, act } from '@testing-library/react-hooks';

describe('test use Download hook', () => {
  let base64: string, name: string, mimeType: string;

  beforeEach(() => {
    base64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    name = 'test.png';
    mimeType = 'image/png';
  });

  it('test hook use base64', () => {
    const { result } = renderHook(() => useDownLoad(base64, { downloadFileName: name, mimeType }));
    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.run();
    });
  });
});
