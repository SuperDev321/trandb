import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CustomTextField from '../../CustomTextField';
import OutlinedButton from '../../OutlinedButton';
import {getSocket} from '../../../utils';
const StyledDialog = withStyles((theme) => ({
    root: {
        direction: 'ltr'
    },
    paper: {
        background: theme.palette.primary.main,
        color: 'white',
        padding: theme.spacing(1)
    }
}))((props) => (
    <Dialog
        {...props}
    />
))

const PasswordModal = ({room, open, setOpen}) => {
    const [password, setPassword] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const handleClose = () => {
        setOpen(false);
    };
    const socket = getSocket();
    const handleJoin = () => {
        socket.emit('join room' , {room, password}, (result, message) => {
            if(result) {
                setOpen(false);
            } else {
                enqueueSnackbar(message, {variant: 'error'})
            }
        })
        setPassword('');
    }

    return (
        <StyledDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">Join room</DialogTitle>
            <DialogContent>
                <CustomTextField
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    label="Password" type="password" name="password" autoFocus autoComplete="off"
                />
            </DialogContent>
            <DialogActions style={{justifyContent: 'center'}}>
                <OutlinedButton autoFocus onClick={handleJoin} color="primary">
                    Join
                </OutlinedButton>
                <OutlinedButton onClick={handleClose} color="primary">
                    Cancel
                </OutlinedButton>
            </DialogActions>
        </StyledDialog>
    );
}

export default PasswordModal;