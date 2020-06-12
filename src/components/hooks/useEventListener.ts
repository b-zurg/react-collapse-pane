import { useEffect } from 'react';

export function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener?: (this: Document, ev: DocumentEventMap[K]) => void
): void {
  useEffect(() => {
    if (!listener) return;

    document.addEventListener(type, listener);

    return (): void => {
      document.removeEventListener(type, listener);
    };
  }, [type, listener]);
}
