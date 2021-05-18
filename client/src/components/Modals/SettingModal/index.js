import React, { useState, useEffect, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    // MuiDialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    Settings,
} from '@material-ui/icons'
import {useTranslation} from 'react-i18next';
import ThemeSetting from './ThemeSetting';
import MessageSetting from './MessageSetting';
import {SettingContext} from '../../../context';
import SoundSetting from './SoundSetting';
import LanguageSetting from './LanguageSetting';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

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

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});
  
const DialogTitle = withStyles(styles)((props) => {
const { children, classes, onBack, onClose, ...other } = props;
return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
    <Typography variant="h6">{children}</Typography>
    {onBack ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onBack}>
        <ArrowBackIcon />
        </IconButton>
    ) : null}
    {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
        </IconButton>
    ) : null}
    </MuiDialogTitle>
);
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    }
}))

const SettingModal = () => {
    const {messageSize, setMessageSize, enablePokeSound, setEnablePokeSound, enablePrivateSound, setEnablePrivateSound,
        enablePublicSound, setEnablePublicSound, language, setLanguage, enableSysMessage, setEnableSysMessage
    } = useContext(SettingContext);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(null);
    const classes = useStyles();
    const {t} = useTranslation();
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickBack = () => {
        setPage(null);
    }
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
            <DialogTitle id="responsive-dialog-title"
                onBack={page && handleClickBack}
                onClose={!page && handleClose}
            >
                {t('SettingModal.settings')+(page?`/${t('SettingModal.'+page)}`:'')}
            </DialogTitle>
            <DialogContent>
                {!page &&
                    <List className={classes.root}>
                        <ListItem button onClick={()=>setPage('themes')}>
                            <ListItemText primary={t('SettingModal.themes')} />
                        </ListItem>
                        <ListItem button onClick={()=>setPage('languages')}>
                            <ListItemText primary={t('SettingModal.languages')} />
                        </ListItem>
                        <ListItem button onClick={()=>setPage('messages')}>
                            <ListItemText primary={t('SettingModal.messages')} />
                        </ListItem>
                        <ListItem button onClick={()=>setPage('notifications')}>
                            <ListItemText primary={t('SettingModal.notifications')}/>
                        </ListItem>
                    </List>
                }
                {page === 'themes' ?
                    <ThemeSetting />:null
                }
                {page === 'languages' ?
                    <LanguageSetting
                        language={language}
                        setLanguage={setLanguage}
                    />:null
                }
                {page === 'messages' ?
                    <MessageSetting
                        messageSize={messageSize}
                        setMessageSize={setMessageSize}
                        enableSysMessage={enableSysMessage}
                        setEnableSysMessage={setEnableSysMessage}
                    />: null
                }
                {page === 'notifications' ?
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