import { ReactNode } from 'react';
import { validateIsRequired } from './validators';

// type GetFieldType<T extends FormField<unknown, {}>> = T[typeof Field]['get'];
// type MaybeArray<T> = T | T[];

export type ValidationUtils = typeof utils; /* {
  validateIsRequired(value: unknown): ReactNode;
  validateIsEmail(value: unknown): ReactNode;
  validateIsNumber(value: unknown): ReactNode;
  validateIsString(value: unknown): ReactNode;
}*/

const utils = {
  validateIsRequired,
};

export function useFormValidation(...delegates: ((utils: ValidationUtils) => ReactNode | void)[]): ReactNode {
  const processValidations = () => {
    let result: ReactNode | void = null;
    delegates.some(delegate => {
      result = delegate(utils);
      return result != null;
    });
    return result ?? null;
  };

  return processValidations();
}


// export function useFormValidation(field: F, validate: MaybeArray<(value: GetFieldType<F>,
//   record: F[typeof Field]['recordType']) => string | void | undefined | null>) {
//   const { validation: { addHandler } } = useContext(Context);
//   const [error, setError] = useState<string>();

//   const handler = useBound((record: {}) => {
//     let errorFound = false;
//     if (field[Field].hasBeenTouched) {
//       const validators = is.array(validate) ? validate : [validate];
//       errorFound = validators.some(delegate => {
//         const result = delegate(field[Field].get, record);
//         if (is.empty(result)) return false;
//         if (error !== result) setError(typeof (result) === 'string' ? result : undefined);
//         return true;
//       });
//     }
//     if (!errorFound && error != null) setError(undefined);
//     return !errorFound;
//   });

//   useSubscription(() => addHandler(handler));

//   return { error };
// }