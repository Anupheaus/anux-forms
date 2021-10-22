import { useForceUpdate } from 'anux-react-utils';
import { useLayoutEffect } from 'react';
// import { FormField } from './models';
import { useProxyField } from './proxy';

export function useFormField<T>(field: T) {
  const { original, current, isTouched } = useProxyField(field);
  const refresh = useForceUpdate();

  useLayoutEffect(() => {
    const unsubscribeFromCurrent = current.onChanged(() => refresh());
    const unsubscribeFromOriginal = original.onChanged(() => refresh());
    return () => {
      unsubscribeFromCurrent();
      unsubscribeFromOriginal();
    };
  }, [current, original]);

  return {
    get get() { return current.get(); },
    set: current.set,
    isTouched,
  };
}