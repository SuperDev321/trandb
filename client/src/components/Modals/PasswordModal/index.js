import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../../CustomTextField';
import OutlinedButton from '../../OutlinedButton';
import { ChatContext } from '../../../context';
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
    const { enqueueSnackbar } = useSnackbar();
    const { joinPrivateRoom } = useContext(ChatContext);
    const handleClose = () => {
        setOpen(false);
    };
    const { t } = useTranslation();
    const handleJoin = () => {
        joinPrivateRoom(room, password)
        .then((result) => {
            setOpen(false);
        })
        .catch((error) => {
            enqueueSnackbar(t('PasswordModal.wrong'), {variant: 'error'});
        })
        setPassword('');
    }

    return (
        <StyledDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{t('PasswordModal.title')}</DialogTitle>
            <DialogContent>
                <CustomTextField
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    label={t('PasswordModal.password')} type="password" name="password" autoFocus autoComplete="off"
                />
            </DialogContent>
            <DialogActions style={{justifyContent: 'center'}}>
                <OutlinedButton autoFocus onClick={handleJoin} color="primary">
                {t('PasswordModal.join')}
                </OutlinedButton>
                <OutlinedButton onClick={handleClose} color="primary">
                {t('PasswordModal.cancel')}
                </OutlinedButton>
            </DialogActions>
        </StyledDialog>
    );
}

export default PasswordModal;