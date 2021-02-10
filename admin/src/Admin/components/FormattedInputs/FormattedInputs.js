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

export default function FormattedInputs({textLabel, value, onChange}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        label={textLabel}
        value={value}
        onChange={onChange}
        name="numberformat"
        InputProps={{
          inputComponent: IpMaskInput,
        }}
      />
    </div>
  );
}
