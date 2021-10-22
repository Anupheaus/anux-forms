import { FormControl, FormHelperText, InputLabel } from '@material-ui/core';
import { anuxPureFC } from 'anux-react-utils';
import { ReactNode } from 'react';
import { RequiredIndicator } from './requiredIndicator';

interface Props {
  id: string;
  label?: ReactNode;
  isRequired?: boolean;
  error?: ReactNode;
  shouldShrinkLabel?: boolean;
}

export const FieldWrapper = anuxPureFC<Props>('FieldWrapper', ({
  id,
  error,
  label,
  isRequired = false,
  shouldShrinkLabel,
  children = null,
}) => {
  return (
    <FormControl error={error != null} fullWidth>
      {label && (
        <InputLabel shrink={shouldShrinkLabel} htmlFor={id}>
          <RequiredIndicator isRequired={isRequired}>{label}</RequiredIndicator>
        </InputLabel>
      )}
      {children}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
});