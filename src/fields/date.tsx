import { ChangeEvent, useMemo, useState } from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { FormControl, FormHelperText, IconButton, Input, InputAdornment, InputLabel, InputProps } from '@material-ui/core';
import { useFormField } from '../useFormField';
import { FieldTag, RequiredIndicator, useOnChangeWrapper } from './utils';
import { anuxPureFC, Tag, useBound, useId, useJoinClassNames, useOnChange } from 'anux-react-utils';
import { MdVisibility as VisibilityIcon, MdVisibilityOff as VisibilityOffIcon } from 'react-icons/md';
import { is } from 'anux-common';
import { useFormValidation } from '../useFormValidation';
import { useForm } from '../useForm';
import { styledTag, styles } from '../theme';
import { makeStyles } from '@material-ui/styles';
import moment from 'anux-common/node_modules/moment';
import { FieldWrapper } from './utils/fieldWrapper';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const useStyles = makeStyles({
  input: {
    backgroundColor: 'transparent!important',
  },
});

interface Props {
  label?: string;
  className?: string;
  type?: 'date' | 'time' | 'datetime';
  format?: string;
  isRequired?: boolean;
  field: Date | string | number | undefined;
}

export const DateField = anuxPureFC<Props>('DateField', ({
  label,
  className,
  type = 'datetime',
  format,
  isRequired = false,
  field,
}) => {
  const classes = useStyles();
  const id = `date_${useId().replace(/-/g, '')}`;
  const { get, set, isTouched } = useFormField(field);
  const { events: { onReset } } = useForm();
  const error = useFormValidation(({ validateIsRequired }) => validateIsRequired(get, isRequired, isTouched));
  const [shouldShrinkLabel, setShouldShrinkLabel] = useState(false);
  const date = useMemo(() => {
    if (is.date(get)) return moment(get).utc(false).toDate();
    if (is.string(get)) return moment(get, format).utc(false).toDate();
    if (is.number(get)) return moment(new Date(get)).utc(false).toDate();
    return null;
  }, [get, format]);

  console.log({ get, date });

  const onChange = useBound((updatedDate: MaterialUiPickersDate, value: string | null | undefined) => {

    console.log({ updatedDate, value, format: (updatedDate as any)._f });
  });

  const inputClasses = useMemo<InputProps['classes']>(() => ({
    input: classes.input,
  }), []);

  const picker = useMemo(() => {
    switch (type) {
      case 'datetime':
        return (
          <KeyboardDateTimePicker
            id={id}
            value={date}
            label={<RequiredIndicator isRequired={isRequired}>{label}</RequiredIndicator>}
            onChange={onChange}
            format={format}
          />
        );
      default: return null;
    }
  }, [type]);

  return (
    <FieldTag name="date-field" className={className}>
      {picker}
    </FieldTag>
  );
});