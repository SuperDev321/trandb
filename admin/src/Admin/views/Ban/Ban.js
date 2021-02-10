import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BanComponent from 'Admin/views/Ban/BannedUsers.js';
import CreateComponent from 'Admin/views/Ban/Create.js';

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
            <BanComponent onClickNew={() => setCreate(false)} />
          ): (<CreateComponent onClickBack={() => setCreate(true)} />)}
    </div>
  );
}
