import React from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedButton from '../OutlinedButton';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.primary.main,
        display: 'flex',
        padding: '30px 30px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: theme.palette.primary.text
    },
    actionButton: {
        padding: '10px',
    }
}));

const LoginSelect = ({onSelect}) => {
    const classes = useStyles();
    const { t } = useTranslation();


    return (
        <Card className={classes.root}>
            <h2>{t('LoginPage.select_mode')}</h2>
            <div className={classes.actionButton} onClick={() => { onSelect(false) }}>
                <OutlinedButton >{t('LoginPage.login')}
                </OutlinedButton>
            </div>
            <div className={classes.actionButton} onClick={() => { onSelect(true) }}>
                <OutlinedButton >{t('LoginPage.guest_join_chat')}</OutlinedButton>
            </div>
            
        </Card>
    )
}

export default LoginSelect;