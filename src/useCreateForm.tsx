import { AnyObject, createSubscriber, PromiseMaybe } from 'anux-common';
import { useBound, useForceUpdate, useOnUnmount } from 'anux-react-utils';
import { useEffect, useMemo, useRef } from 'react';
import { createFormContext } from './context';
import { createForm } from './Form';
import { createFormToolbar } from './FormToolbar';
// import { ConvertToFormRecord } from './models';
import { useProxy } from './proxy';

interface Props<T extends AnyObject> {
  record: T;
  onSave?(record: T): PromiseMaybe<T | void>;
  onReset?(): void;
  onCancel?(): void;
}

export function useCreateForm<T extends AnyObject>({
  record: providedRecord,
  onSave,
  onReset,
}: Props<T>) {
  const recordRef = useRef(providedRecord);
  const lastProvidedRecordRef = useRef(providedRecord);
  const isFirstEffectRef = useRef(true);
  const { invoke: invokeOnChanged, subscribe: onChanged } = useMemo(() => createSubscriber<() => void>(), []);

  if (!Reflect.areDeepEqual(lastProvidedRecordRef.current, providedRecord)) {
    recordRef.current = providedRecord;
    lastProvidedRecordRef.current = providedRecord;
  }

  const refresh = useForceUpdate();
  const isUnmountedRef = useOnUnmount();

  const { proxy, current, original, setAllFieldsIsTouched } = useProxy(recordRef.current, useBound(invokeOnChanged));

  const updateRecordRef = (newRecord: T, compareTo = recordRef.current) => {
    setTimeout(() => {
      if (isUnmountedRef.current) return;
      if (Reflect.areDeepEqual(newRecord, compareTo)) return;
      recordRef.current = newRecord;
      refresh();
    }, 1);
  };

  const save = async () => {
    setAllFieldsIsTouched(true);
    if (onSave) {
      const copy = await onSave(current);
      if (copy) { updateRecordRef(copy); return; }
    }
    updateRecordRef(current);
  };

  const reset = async () => {
    if (onReset) onReset();
    updateRecordRef(Object.clone(original), current);
  };

  const context = createFormContext(current, original, save, reset, onChanged);
  const Form = createForm(context);
  const FormToolbar = createFormToolbar(context);

  useEffect(() => {
    if (isFirstEffectRef.current) { isFirstEffectRef.current = false; return; }
    invokeOnChanged();
  }, [proxy]);

  return {
    record: proxy,
    Form,
    FormToolbar,
    save: context.save,
    reset: context.reset,
    validate: context.validate,
  };
}
