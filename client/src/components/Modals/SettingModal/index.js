import React, { useState, useEffect } from 'react';
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
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(null);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const {t, i18n} = useTranslation();
    const handleClose = () => {
        setOpen(false);
    };
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
                        <ListItem button>
                            <ListItemText primary="Bluetooth" />
                        </ListItem>
                    </List>
                }
                {page === 'theme' &&
                    <ThemeSetting />
                }
            </DialogContent>
        </StyledDialog>
        </>
    );
}

export default SettingModal;