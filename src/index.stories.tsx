// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/styles';
import { anuxFC, anuxPureFC } from 'anux-react-utils';
import { ExoticComponent, useState } from 'react';
import { TextField, useCreateForm } from '.';
import { DateField } from './fields/date';
import { styledTag, styles } from './theme';
import { storyUtils } from './utils';

const PreviewDataTag = styledTag('preview-data', {
  ...styles.flex.auto,
  height: 200,
  margin: 12,
  marginTop: 0,
  borderTop: 'solid 1px black',
});

const FormTestContainerTag = styledTag('form-test-container', {
  ...styles.flex.none,
  flexDirection: 'column',
});

const useStyles = makeStyles({
  form: {
    margin: 12,
    minWidth: 400,
  },
  formToolbar: {
    marginTop: 12,
  },
});

export default storyUtils.createMeta({
  name: 'anux-forms/form',
  title: 'anux-forms',
  component: anuxFC('', () => null) as ExoticComponent,
});

interface LoginForm {
  email?: string;
  password?: string;
}

const loginForm: LoginForm = {
  email: 'tony@halespropertysolutions.com',
  password: '',
};

interface SimpleForm {
  forename?: string;
  surname?: string;
  dateOfBirth?: Date;
}

const simpleForm: SimpleForm = {
  forename: 'Tony',
  surname: 'Hales',
};

interface PreviewProps {
  data: unknown;
}

const PreviewData = anuxPureFC<PreviewProps>('PreviewData', ({ data }) => (<PreviewDataTag>{JSON.stringify(data, null, 2)}</PreviewDataTag>));

export const LoginForm = storyUtils.createStory({
  title: 'Login Form',
  component: () => {
    const classes = useStyles();
    const [data, setData] = useState(loginForm);
    const { record, Form, FormToolbar } = useCreateForm({ record: data, onSave: updatedRecord => setData(updatedRecord) });

    return (
      <FormTestContainerTag>
        <Form className={classes.form}>
          <TextField
            field={record.email}
            label={'Email Address'}
            isRequired
          />
          <TextField
            field={record.password}
            label={'Password'}
            isPassword
            isRequired
          />
          <FormToolbar className={classes.formToolbar} />
        </Form>
        <PreviewData data={data} />
      </FormTestContainerTag>
    );
  },
});

export const SimpleForm = storyUtils.createStory({
  title: 'Simple Form',
  component: () => {
    const classes = useStyles();
    const [data, setData] = useState(simpleForm);
    const { record, Form, FormToolbar } = useCreateForm({ record: data, onSave: updatedRecord => setData(updatedRecord) });

    return (
      <FormTestContainerTag>
        <Form className={classes.form}>
          <TextField
            field={record.forename}
            label={'Forename'}
            isRequired
          />
          <TextField
            field={record.surname}
            label={'Surname'}
            isRequired
          />
          <DateField
            field={record.dateOfBirth}
            label={'Date of Birth'}
            isRequired
          />
          <FormToolbar className={classes.formToolbar} />
        </Form>
        <PreviewData data={data} />
      </FormTestContainerTag>
    );
  },
});
