import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logs from './Logs';
import RoomSelector from './Selector';
import RoomContext from './context';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));



export default function BanTable() {
    const classes = useStyles();
    const [room, setRoom] = useState(null);
    const [type, setType] = useState('public');
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    return (
        <RoomContext.Provider value={{
            room, type, from, to, setRoom, setType, setFrom, setTo
        }}>
            <div className={classes.root}>
                <RoomSelector />
                <Logs />
            </div>
        </RoomContext.Provider>
        
    );
}

export {
    RoomContext
}