import { createSubscriber } from 'anux-common';

export function createInternalApi() {
  const { invoke: invokeSetTouched, subscribe: subscribeSetTouched } = createSubscriber<(isTouched: boolean) => void>();

  return {
    setTouched: invokeSetTouched,
    onSetTouched: subscribeSetTouched,
  };
}

export type InternalApi = ReturnType<typeof createInternalApi>;
