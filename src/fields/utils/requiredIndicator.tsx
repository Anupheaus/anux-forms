import { makeStyles } from '@material-ui/styles';
import { anuxPureFC } from 'anux-react-utils';

const useStyles = makeStyles({
  requiredIndicator: {
    color: 'red',
  },
});

interface Props {
  isRequired?: boolean;
}

export const RequiredIndicator = anuxPureFC<Props>('RequiredIndicator', ({
  isRequired = false,
  children = null,
}) => {
  const classes = useStyles();
  return (
    <>
      {children}
      {isRequired && <span className={classes.requiredIndicator}>*</span>}
    </>
  );
});
