import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditComponent from 'Admin/views/Room/Edit.js';
import RoomComponent from 'Admin/views/Room/RoomTable.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);
  const [rowToEdit, setRowToEdit] = React.useState(false);
  const handleClickEdit = (row) => {
    setRowToEdit(row);
    setEdit(true);
  }

  return (
    <div className={classes.root}>
      {edit ? (
          <EditComponent onClickBack={() => setEdit(false)} room={rowToEdit}/>
        ): (<RoomComponent onClickEdit={handleClickEdit} />)}
    </div>
  );
}
