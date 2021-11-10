import React, {useState, useReducer} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from "Admin/components/CustomButtons/Button.js";
import Logs from './Logs';
import RoomSelector from './Selector';
import RoomContext from './context';
import config from '../../../config';
import Axios from 'axios';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

function roomReducer (state, action) {
    switch (action.type) {
        case 'resolved': {
            return {status: 'resolved', data: action.data, error: null}
        }
        case 'pending': {
            return {status: 'pending', data: null}
        }
        case 'rejected': {
            return {status: 'rejected', data: null, error: action.error}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

export default function PrivateLogs() {
    const classes = useStyles();
    const [state, dispatch] = useReducer(roomReducer, {
        status: 'idle',
        data: null,
        error: null
    });

    const clearAll = () => {
        let token = window.localStorage.getItem('token');
        Axios.delete(`${config.server_url}/api/messages/private`, {
            headers: {
                authorization: token
            }
        });
    }

    return (
        <RoomContext.Provider value={{
            state, dispatch
        }}>
            <Button style={{float: 'right'}} variant="contained" color="primary" onClick={() => clearAll()}>Clear All</Button>
            <div className={classes.root}>
                <RoomSelector />
                <Logs />
            </div>
        </RoomContext.Provider>
        
    );
}
