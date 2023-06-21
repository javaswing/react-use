import { useCallback, useEffect, useRef } from 'react';

export default function useTimeout(fn: () => void, delay?: number) {
  const clearFlag = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (clearFlag.current) {
      clearTimeout(clearFlag.current);
    }
  }, []);

  useEffect(() => {
    if (typeof delay === 'undefined' || delay < 0) return;
    clearFlag.current = setTimeout(fn, delay);
    return clear;
  }, [clear, delay, fn]);

  return clear;
}
