import { useContext } from 'react';
import { Context } from './context';

export function useForm() {
  const { validate, save, reset, events } = useContext(Context);

  return {
    events,
    save,
    reset,
    validate,
  };
}