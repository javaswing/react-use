interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any;
  removeEventListener(event: Events, fn?: any, options?: any): any;
}

export type GeneralEventListener<E = Event> = {
  (evt: E): void;
};

/**
 *
 * target 包含 window document React Ref 类型节点
 */

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  eventName: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  eventName: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<Names extends string, EventType = Event>(
  target: InferEventTarget<Names>,
  eventName: Names,
  listener: GeneralEventListener<EventType>,
  options: boolean | AddEventListenerOptions
): void;

function useEventListener(...args: any[]) {
  // useEffect(() => {
  //   addEventListener;
  //   window.addEventListener(eventName, listener, options);
  //   return () => {
  //     window.removeEventListener(eventName, listener);
  //   };
  // }, []);
}

export default useEventListener;
