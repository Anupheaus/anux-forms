import { ChangeEvent, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOnChangeWrapper(type: 'input', set: (value: any) => void) {
  return useMemo(() => {
    switch (type) {
      case 'input': return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(event.target.value);
    }
  }, [type, set]);
}