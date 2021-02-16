import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    List
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      minWidth: 400,
      padding: '0 10px',
      backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: '0 10px',
        // borderRadius: '0',
        height: '30px'
    },
}));

export default function DisconnectModal({open, setOpen}) {
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            // onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">Connect failed</DialogTitle>
            <DialogContent>
                <DialogContentText>The connection to the chat was interrupted. Attempting to reconnect...</DialogContentText>
            </DialogContent>
            <DialogActions>
            {/* <Button autoFocus onClick={handleClose} color="primary">
                Cancel
            </Button> */}
            </DialogActions>
        </Dialog>
    );
}