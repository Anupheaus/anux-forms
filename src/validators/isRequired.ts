import { is } from 'anux-common';
import { ReactNode } from 'react';

const message = 'This field is required.';

export function validateIsRequired(value: unknown, isRequired: boolean, isTouched = true): ReactNode {
  if (!isRequired || !isTouched) return null;
  if (value == null || (is.string(value) && value.trim().length === 0)) return message;
}