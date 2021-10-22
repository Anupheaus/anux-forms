// import { AnyFunction, AnyObject, Unsubscribe } from 'anux-common';
// import { MutableRefObject, useMemo, useRef } from 'react';
// import { Field } from '../internalModels';
// import { FormField } from '../models';

// /* eslint-disable @typescript-eslint/indent */
// type ConvertField<T, R extends {}> = T extends string ? FormField<string, R>
//   : T extends number ? FormField<number, R>
//   : T extends boolean ? FormField<boolean, R>
//   : T extends AnyFunction ? never
//   : T extends null ? never
//   : ConvertToFormRecord<T, R>;
// /* eslint-enable @typescript-eslint/indent */

// type ConvertToFormRecord<T extends {}, R extends {}> = {
//   [K in keyof T]-?: ConvertField<T[K], R>;
// };

// interface CreateFormFieldProps {
//   target: AnyObject | undefined;
//   propertyKey: string | number | symbol;
//   receiver: unknown;
//   hasBeenTouchedRef: MutableRefObject<boolean>;
//   validate(): void;
// }

// function createFormField({ target, propertyKey, receiver, hasBeenTouchedRef, validate }: CreateFormFieldProps): FormField<unknown, {}>[typeof Field] {
//   const handlers = new Set<() => void>();
//   const invokeUpdate = () => handlers.forEach(handler => handlers.has(handler) ? handler() : void 0);
//   let hasBeenTouched = false;
//   return {
//     recordType: {},
//     get hasBeenTouched() { return hasBeenTouched || hasBeenTouchedRef.current; },
//     get get() { return Reflect.get(target ?? {}, propertyKey, receiver); },
//     set(value: unknown) {
//       Reflect.set(target, propertyKey, value, receiver);
//       hasBeenTouched = true;
//       validate();
//       invokeUpdate();
//     },
//     onUpdate(handler: () => void): Unsubscribe {
//       handlers.add(handler);
//       return () => handlers.delete(handler);
//     },
//   };
// }

// interface WrapInProxyProps {
//   target: AnyObject | undefined;
//   parent: AnyObject;
//   parentKey: string | number | symbol;
//   hasBeenTouchedRef: MutableRefObject<boolean>;
//   validate(): void;
// }

// function wrapInProxy(props: WrapInProxyProps): AnyObject {
//   const { target, parent, parentKey } = props;
//   const newTarget = target ?? {};
//   return new Proxy(newTarget, {
//     get(propertyTarget, propertyKey, receiver) {
//       if (propertyKey === Field) {

//         return createFormField({ ...props, target: parent, propertyKey: parentKey, receiver });
//       } else {
//         let value = Reflect.get(propertyTarget, propertyKey, receiver);
//         if (!Reflect.has(propertyTarget, propertyKey)) {
//           value = {};
//           Reflect.set(propertyTarget, propertyKey, value, receiver);
//         }
//         return wrapInProxy({ ...props, target: value, parent: propertyTarget, parentKey: propertyKey });
//       }
//     },

//   });
// }

// export function createProxyOf<T extends {}>(record: T, validate: (record: T) => boolean) {
//   const hasBeenTouchedRef = useRef<boolean>(false);
//   const props = useMemo(() => {
//     const cloneOfRecord = Object.clone(record);
//     const validateProxy = () => validate(cloneOfRecord);
//     const proxyOfRecord = wrapInProxy({ target: cloneOfRecord, parent: cloneOfRecord, hasBeenTouchedRef, validate: validateProxy }) as ConvertToFormRecord<T, T>;
//     return {
//       record: proxyOfRecord,
//       validate: validateProxy,
//     };
//   }, [record]);

//   const setTouchedOnFields = (isTouched: boolean) => hasBeenTouchedRef.current = isTouched;

//   return {
//     ...props,
//     setTouchedOnFields,
//   };
// }