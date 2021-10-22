import { makeStyles } from '@material-ui/core';
import { anuxPureFC, useJoinClassNames } from 'anux-react-utils';
import { PropsWithChildren, useMemo } from 'react';
import { Context, ContextProps } from './context';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flex: 'none',
    flexDirection: 'column',
    margin: 0,
  },
});

interface FormProps {
  className?: string;
}

export function createForm(context: ContextProps) {
  const classes = useStyles();
  const join = useJoinClassNames();

  return useMemo(() => anuxPureFC<PropsWithChildren<FormProps>>('AnuxForm', ({
    className,
    children = null,
  }) => (
    <form className={join(classes.form, className)} action="" method="">
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Context.Provider value={context}>
          {children}
        </Context.Provider>
      </MuiPickersUtilsProvider>
    </form>
  )), []);
}
