import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logs from './Logs';
import RoomSelector from './Selector';
import RoomContext from './context';
import Button from "Admin/components/CustomButtons/Button.js";
import config from '../../../config';
import Axios from 'axios';
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

    const clearAll = () => {
        let token = window.localStorage.getItem('token');
        Axios.delete(`${config.server_url}/api/messages/public`, {
            headers: {
                authorization: token
            }
        });
    }

    return (
        <RoomContext.Provider value={{
            room, type, from, to, setRoom, setType, setFrom, setTo
        }}>
            <Button style={{float: 'right'}} variant="contained" color="primary" onClick={() => clearAll()}>Clear All</Button>
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
