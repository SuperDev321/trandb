import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Quizes from './Quizes';
import Setting from './Setting';
import CreateComponent from './Create.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

export default function BanTable() {
  const classes = useStyles();
  const [create, setCreate] = React.useState(true);

  return (
    <div className={classes.root}>
        {create ? (
            <>
            <Setting />
            <Quizes onClickNew={() => setCreate(false)} />
            </>
          ): (<CreateComponent onClose={() => setCreate(true)} />)}
    </div>
  );
}