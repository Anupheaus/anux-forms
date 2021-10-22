// import { AnyFunction, AnyObject } from 'anux-common';
// import { Field } from './internalModels';
// import { FieldProxy } from './proxy/fieldProxy';

// export type FormField<T, R extends {} = {}> = {
//   [Field]: FieldProxy<T, R>;
// };

export type ValidationResult = string | undefined | null | void;

// /* eslint-disable @typescript-eslint/indent */
// type ConvertField<T> = T extends string ? FormField<string, R>
//   : T extends number ? FormField<number, R>
//   : T extends boolean ? FormField<boolean, R>
//   : T extends AnyFunction ? never
//   : T extends null ? never
//   : ConvertToFormRecord<T>;
// /* eslint-enable @typescript-eslint/indent */

// export type ConvertToFormRecord<T extends AnyObject> = {
//   [K in keyof T]-?: ConvertField<T[K]>;
// };
