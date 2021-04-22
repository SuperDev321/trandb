import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

export default function Loading() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CircularProgress disableShrink/>
        </div>
    );
}