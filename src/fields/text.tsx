import { ChangeEvent, useMemo, useState } from 'react';
import { IconButton, Input, InputAdornment, InputProps } from '@material-ui/core';
import { useFormField } from '../useFormField';
import { useOnChangeWrapper, FieldWrapper, useFieldId, FieldTag } from './utils';
import { anuxPureFC, useBound, useOnChange } from 'anux-react-utils';
import { MdVisibility as VisibilityIcon, MdVisibilityOff as VisibilityOffIcon } from 'react-icons/md';
import { is } from 'anux-common';
import { useFormValidation } from '../useFormValidation';
import { useForm } from '../useForm';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  input: {
    backgroundColor: 'transparent!important',
  },
});

interface Props {
  label?: string;
  className?: string;
  autocompleteHint?: string;
  isRequired?: boolean;
  isPassword?: boolean;
  disablePasswordHashing?: boolean;
  field: string | undefined;
}

export const TextField = anuxPureFC<Props>('TextField', ({
  label,
  className,
  autocompleteHint,
  isRequired = false,
  isPassword = false,
  disablePasswordHashing = false,
  field,
}) => {
  const id = useFieldId('text');
  const classes = useStyles();
  const { get, set, isTouched } = useFormField(field);
  const { events: { onReset } } = useForm();
  const error = useFormValidation(({ validateIsRequired }) => validateIsRequired(get, isRequired, isTouched));
  const onChange = useOnChangeWrapper('input', set);
  const [passwordValue, setPasswordValue] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  onReset(() => {
    if (!isPassword) return;
    setPasswordValue('');
  });

  const inputClasses = useMemo<InputProps['classes']>(() => ({
    input: classes.input,
  }), []);

  const togglePasswordVisibility = useBound(() => setPasswordVisibility(p => !p));

  const endAdornment = useMemo<InputProps['endAdornment']>(() => isPassword ? (
    <InputAdornment position="end">
      <IconButton size="small" onClick={togglePasswordVisibility}>
        {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  ) : null, [isPassword, isPasswordVisible]);

  const value = isPassword ? passwordValue : get;
  const changeValue = useBound((event: ChangeEvent<HTMLInputElement>) => {
    if (!isPassword) return onChange(event);
    const newValue = event.target.value;
    setPasswordValue(newValue);
    set(disablePasswordHashing ? newValue : newValue.hash()); // hash the password
  });

  useOnChange(() => {
    if (is.empty(get)) setPasswordValue('');
  }, [get]);

  return (
    <FieldTag name={'text-field'} className={className}>
      <FieldWrapper id={id} label={label} isRequired={isRequired} error={error}>
        <Input
          classes={inputClasses}
          id={id}
          type={isPassword && !isPasswordVisible ? 'password' : 'text'}
          autoComplete={autocompleteHint ?? (isPassword ? 'current-password' : '')}
          value={value ?? ''}
          onChange={changeValue}
          endAdornment={endAdornment}
        />
      </FieldWrapper>
    </FieldTag>
  );
});