import { makeStyles, CSSProperties } from '@material-ui/styles';
import { anuxPureFC, Tag, useJoinClassNames } from 'anux-react-utils';
import { ComponentProps } from 'react';

type TagProps = Omit<ComponentProps<typeof Tag>, 'name'>;

export function styledTag(tag: string, jss: CSSProperties) {
  const useStyles = makeStyles({
    tag: jss,
  });

  return anuxPureFC<TagProps>(tag, ({
    className,
    children = null,
    ...props
  }) => {
    const classes = useStyles();
    const join = useJoinClassNames();
    return (
      <Tag name={tag} className={join(classes.tag, className)} {...props}>
        {children}
      </Tag>
    );
  });
}
