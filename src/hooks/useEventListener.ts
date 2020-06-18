import { useEffect } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener?: (this: Window, ev: WindowEventMap[K]) => void
): void {
  useEffect(() => {
    if (!listener) return;
    window.addEventListener(type, listener);
    return (): void => {
      window.removeEventListener(type, listener);
    };
  }, [type, listener]);
}
