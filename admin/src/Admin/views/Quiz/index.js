import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Quizes from './Quizes';
import Setting from './Setting';
import CreateComponent from './Create.js';
import EditComponent from './Edit.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

export default function BanTable() {
  const classes = useStyles();
  const [create, setCreate] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [rowToEdit, setRowToEdit] = React.useState(null);
  const handleClickEdit = (row) => {
    setRowToEdit(row);
    setEdit(true);
  }

  return (
    <div className={classes.root}>
        {create && <CreateComponent onClose={() => setCreate(false)} />}
        {edit && <EditComponent onClose={()=>setEdit(false)} row={rowToEdit} />}
        {!(edit || create) &&
            <>
            <Setting />
            <Quizes onClickNew={() => setCreate(true)} onClickEdit={handleClickEdit}/>
            </>
        }
    </div>
  );
}