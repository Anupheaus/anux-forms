import { Meta } from '@storybook/react';
import { ReactNode, ExoticComponent, FunctionComponent } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface MetaConfig {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ExoticComponent<any>;
  title: ReactNode;
}

function createMeta({
  name,
  component,
}: MetaConfig): Meta {
  return {
    title: name,
    component,
  };
}

const useStyles = makeStyles({
  title: {
    paddingBottom: 12,
  },
  componentTestArea: {
    display: 'flex',
    flex: 'none',
    width: 'max-content',
    position: 'relative',
    padding: 10,

    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderStyle: 'solid',
      borderWidth: '10px 0',
      borderImage: 'repeating-linear-gradient(-75deg, yellow, yellow 10px, black 10px, black 20px) 20',
      pointerEvents: 'none',
    },

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderStyle: 'solid',
      borderWidth: '0 10px',
      borderImage: 'repeating-linear-gradient(-12deg, yellow, yellow 10px, black 10px, black 20px) 20',
      pointerEvents: 'none',
    }
  },
});

interface StoryConfig {
  title: ReactNode;
  component: FunctionComponent;
}

function createStory({
  title,
  component: Component,
}: StoryConfig) {
  return (args: never) => {
    const classes = useStyles();
    return (
      <>
        <Typography className={classes.title} variant={'h5'}>{title}</Typography>
        <div className={classes.componentTestArea}>
          <Component {...args} />
        </div>
      </>
    );
  };
}

export const storyUtils = {
  createMeta,
  createStory,
};
