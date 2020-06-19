import { useEffect } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener?: (this: Window, ev: WindowEventMap[K]) => void
): void {
  useEffect(() => {
    const abortController = new AbortController();
    if (!listener) return;
    window.addEventListener(type, listener);
    return (): void => {
      window.removeEventListener(type, listener);
      abortController.abort();
    };
  }, [type, listener]);
}
