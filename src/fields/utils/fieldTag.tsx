import { makeStyles } from '@material-ui/styles';
import { anuxPureFC, Tag, useJoinClassNames } from 'anux-react-utils';
import { styles } from '../../theme';

const useStyles = makeStyles({
  fieldTag: {
    ...styles.flex.none,
  },
});

interface Props {
  name: string;
  className?: string;
}

export const FieldTag = anuxPureFC<Props>('FieldTag', ({
  name,
  className,
  children = null,
}) => {
  const classes = useStyles();
  const join = useJoinClassNames();

  return (
    <Tag name={name} className={join(classes.fieldTag, className)}>
      {children}
    </Tag>
  );
});