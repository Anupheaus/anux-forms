import { AnyObject, createSubscriber, PromiseMaybe, Unsubscribe } from 'anux-common';
import { useBound } from 'anux-react-utils';
import { createContext, useLayoutEffect, useMemo, useRef } from 'react';

export interface ContextProps<T extends AnyObject = AnyObject> {
  validation: {
    addHandler(handler: (record: T) => boolean): Unsubscribe;
  };
  events: {
    onReset(callback: () => void): Unsubscribe;
    onChanged(callback: () => void): Unsubscribe;
    onDirtyChanged(callback: (isDirty: boolean) => void): Unsubscribe;
  };
  save(): Promise<void>;
  reset(): void;
  validate(): Promise<boolean>;
}

export const Context = createContext<ContextProps>({
  validation: {
    addHandler: () => () => void 0,
  },
  events: {
    onReset: () => () => void 0,
    onChanged: () => () => void 0,
    onDirtyChanged: () => () => void 0,
  },
  save: Promise.resolve,
  reset: () => void 0,
  validate: () => Promise.resolve(true),
});

export function createFormContext<T extends AnyObject>(current: T, original: T, onSave: () => PromiseMaybe<void>, invokeReset: () => void,
  onChanged: (callback: () => void) => Unsubscribe) {
  const validationHandlersRef = useRef(new Set<(record: T) => boolean>());
  const lastIsDirty = useRef(false);
  const { invoke: invokeOnReset, subscribe: onReset } = useMemo(() => createSubscriber<() => void>(), []);
  const { invoke: invokeOnDirtyChanged, subscribe: onDirtyChanged } = useMemo(() => createSubscriber<(isDirty: boolean) => void>(), []);

  const addValidationHandler = useBound((handler: (record: T) => boolean) => {
    validationHandlersRef.current.add(handler);
    return () => validationHandlersRef.current.delete(handler);
  });

  const validate = useBound(async (): Promise<boolean> => {
    let isValid = true;
    validationHandlersRef.current.forEach(handler => {
      if (!handler(current)) isValid = false;
    });
    return isValid;
  });

  const save = useBound(async () => {
    if (!(await validate())) return;
    await onSave();
  });

  const reset = useBound(() => {
    invokeReset();
    invokeOnReset();
  });

  const checkDirtiness = useBound(() => {
    const isDirty = !Reflect.areDeepEqual(current, original);
    if (isDirty === lastIsDirty.current) return;
    lastIsDirty.current = isDirty;
    invokeOnDirtyChanged(isDirty);
  });

  useLayoutEffect(() => onChanged(checkDirtiness), [onChanged]);

  const context = useMemo<ContextProps>(() => ({
    validation: {
      addHandler: addValidationHandler,
    },
    save,
    reset,
    validate,
    events: {
      onReset,
      onChanged,
      onDirtyChanged,
    },
  }), []);

  return context;
}