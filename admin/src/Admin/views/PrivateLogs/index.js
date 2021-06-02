import React, {useState, useReducer} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logs from './Logs';
import RoomSelector from './Selector';
import RoomContext from './context';
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

    return (
        <RoomContext.Provider value={{
            state, dispatch
        }}>
            <div className={classes.root}>
                <RoomSelector />
                <Logs />
            </div>
        </RoomContext.Provider>
        
    );
}