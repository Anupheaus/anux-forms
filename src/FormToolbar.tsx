import { Button } from '@material-ui/core';
import { anuxPureFC } from 'anux-react-utils';
import { ReactNode, useLayoutEffect, useMemo, useState } from 'react';
import { ContextProps } from './context';
import { styledTag, styles } from './theme';

interface Props {
  className?: string;
  hideResetButton?: boolean;
  saveButtonLabel?: ReactNode;
  resetButtonLabel?: ReactNode;
}

const FormToolbar = styledTag('form-toolbar', {
  ...styles.flex.auto,
  justifyContent: 'flex-end',
  gap: 8,
});

export function createFormToolbar({ save, reset, events: { onDirtyChanged } }: ContextProps) {
  return useMemo(() => anuxPureFC<Props>('AnuxFormToolbar', ({
    className,
    hideResetButton = false,
    saveButtonLabel = 'Save',
    resetButtonLabel = 'Reset',
  }) => {
    const [isDirty, setIsDirty] = useState(false);

    useLayoutEffect(() => onDirtyChanged(setIsDirty), [onDirtyChanged]);

    return (
      <FormToolbar className={className}>
        {!hideResetButton && <Button variant="outlined" color="primary" onClick={reset} disabled={!isDirty}>{resetButtonLabel}</Button>}
        <Button variant="contained" color="primary" onClick={save} disabled={!isDirty}>{saveButtonLabel}</Button>
      </FormToolbar>
    );
  }), []);
}
