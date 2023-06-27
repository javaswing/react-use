import { expect, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-hooks';
import useTimeout from '../src/useTimeout';

interface ParamsObj {
  fn: (...arg: any) => any;
  delay: number | undefined;
}

const setUp = ({ fn, delay }: ParamsObj) => renderHook(() => useTimeout(fn, delay));

describe('useTimeout', () => {
  beforeAll(() => {
    // enable fake time
    jest.useFakeTimers();
  });

  afterAll(() => {
    // 执行完成后恢复默认行为
    jest.useRealTimers();
  });

  it('timeout should work', () => {
    // @see https://jestjs.io/zh-Hans/docs/mock-function-api/#jestfnimplementation
    // mock a function
    const callback = jest.fn();
    setUp({ fn: callback, delay: 20 });

    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(70);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('timeout should stop', () => {
    const callback = jest.fn();

    setUp({ fn: callback, delay: undefined });
    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(0);

    setUp({ fn: callback, delay: -2 });
    jest.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('timeout should be clear', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'clearTimeout');

    const hook = setUp({ fn: callback, delay: 20 });
    expect(callback).not.toBeCalled();

    hook.result.current();
    jest.advanceTimersByTime(30);
    expect(callback).toHaveBeenCalledTimes(0);

    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});
