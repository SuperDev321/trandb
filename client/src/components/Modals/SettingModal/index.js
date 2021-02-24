import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core';
import {
    Settings,
} from '@material-ui/icons'
import { useSnackbar } from 'notistack';
import {useTranslation} from 'react-i18next';
import CustomTextField from '../../CustomTextField';
import OutlinedButton from '../../OutlinedButton';
import ThemeSetting from './ThemeSetting';
import MessageSetting from './MessageSetting';
import {SettingContext} from '../../../context';
import SoundSetting from './SoundSetting';

const StyledDialog = withStyles((theme) => ({
    root: {
        direction: 'ltr',
    },
    paper: {
        background: theme.palette.primary.main,
        color: 'white',
        width: 400
        // padding: theme.spacing(1)
    }
}))((props) => (
    <Dialog
        {...props}
    />
));

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    }
}))

const SettingModal = () => {
    const {messageSize, setMessageSize, enablePokeSound, setEnablePokeSound, enablePrivateSound, setEnablePrivateSound,
        enablePublicSound, setEnablePublicSound,
    } = useContext(SettingContext);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(null);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {t, i18n} = useTranslation();
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        if(open) {
            setPage(null)
        }
    }, [open])
    return (
        <>
        <IconButton aria-label="show 17 new notifications" color="inherit"
            onClick={() => {setOpen(true)}}
        >
            <Settings/>
        </IconButton>
        <StyledDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{t('SettingModal.settings')+(page?`/${page}`:'')}</DialogTitle>
            <DialogContent>
                {!page &&
                    <List className={classes.root}>
                        <ListItem button onClick={()=>setPage('theme')}>
                            <ListItemText primary="Theme" />
                        </ListItem>
                        <ListItem button onClick={()=>setPage('message')}>
                            <ListItemText primary="Message" />
                        </ListItem>
                        <ListItem button onClick={()=>setPage('sound')}>
                            <ListItemText primary="Sound" />
                        </ListItem>
                    </List>
                }
                {page === 'theme' ?
                    <ThemeSetting />:null
                }
                {page === 'message' ?
                    <MessageSetting messageSize={messageSize} setMessageSize={setMessageSize} />: null
                }
                {page === 'sound' ?
                    <SoundSetting
                    enablePokeSound={enablePokeSound}
                    setEnablePokeSound={setEnablePokeSound}
                    enablePrivateSound={enablePrivateSound}
                    setEnablePrivateSound={setEnablePrivateSound}
                    enablePublicSound={enablePublicSound}
                    setEnablePublicSound={setEnablePublicSound}
                    />: null
                }
            </DialogContent>
        </StyledDialog>
        </>
    );
}

export default SettingModal;