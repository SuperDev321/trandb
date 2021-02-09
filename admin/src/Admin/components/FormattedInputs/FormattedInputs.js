import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IpMaskInput from '../IpMaskInput';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function FormattedInputs({textLabel}) {
  const classes = useStyles();
  const [value, setValue] = React.useState('10.10.10.10');

  const handleChange = (event) => {
    setValue( event.target.value);
  };

  return (
    <div className={classes.root}>
      <TextField
        label={textLabel}
        value={value}
        onChange={handleChange}
        name="numberformat"
        InputProps={{
          inputComponent: IpMaskInput,
        }}
      />
    </div>
  );
}
