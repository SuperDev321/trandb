import React from 'react';
import Notification from 'rc-notification';
import 'rc-notification/assets/index.css';
import {
    Button
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core';
import {
    Close
} from '@material-ui/icons';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
let notification = null;
Notification.newInstance({
  style: {top: 20, left: 'calc(50% - 160px)', zIndex: 100, position: "fixed"}
}, (n) => notification = n);

const closeNotice = (key) => {
    if(notification) {
        notification.removeNotice(key);
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    messageContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
    },
    confirmArea: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    btnOK: {
        marginRight: 5
    }
}))


const PermissionNoticeEl = ({username, roomName, noticeKey, callback, closeNotice}) => {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const message = t('ChatApp.system_user_request_video_permission', {username, roomName});
    const handleClickAccept = () => {
        callback(true);
        closeNotice(noticeKey);
    }
    const handleClickDeney = () => {
        callback(false);
        closeNotice(noticeKey);
    }

    return (
        <div className={classes.root}>
        <div className={classes.messageContent}>
          <span style={{maxWidth: "85%"}}>{message}</span>
          <Close onClick={() => closeNotice(noticeKey)} className="icon icon-alert-close" size="20px"
                 style={{color: "white"}}/>
        </div>
        <div className={classes.confirmArea}>
          <Button variant="contained" color="primary" size="small" onClick={handleClickAccept}
                  className={classes.btnOK}>{t('ChatApp.accept')}</Button>
          <Button variant="contained" size="small" onClick={handleClickDeney}
                  className={classes.btnCancel}>{t('ChatApp.deny')}</Button>
        </div>
      </div>
    )
}

const PermissionSendedEl = ({username, roomName, noticeKey, callback, closeNotice}) => {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const message = t('ChatApp.system_user_request_video_permission', {username, roomName});
    const handleClickAccept = () => {
        callback(true);
        closeNotice(noticeKey);
    }
    const handleClickDeney = () => {
        callback(false);
        closeNotice(noticeKey);
    }

    return (
        <div className={classes.root}>
        <div className={classes.messageContent}>
          <span style={{maxWidth: "85%"}}>{message}</span>
          <Close onClick={() => closeNotice(noticeKey)} className="icon icon-alert-close" size="20px"
                 style={{color: "white"}}/>
        </div>
        <div className={classes.confirmArea}>
          <Button variant="contained" color="primary" size="small" onClick={handleClickAccept}
                  className={classes.btnOK}>{t('ChatApp.accept')}</Button>
          <Button variant="contained" size="small" onClick={handleClickDeney}
                  className={classes.btnCancel}>{t('ChatApp.deny')}</Button>
        </div>
      </div>
    )
}



const permissionRequest = (username, roomName, callback) => {
    const key = Date.now();
    notification.notice({
        content: <PermissionNoticeEl
            username={username}
            roomName ={roomName}
            noticeKey={key}
            callback={callback}
            closeNotice={closeNotice}
            />,
        duration: null,
        key,
        onClose() {
            console.log('closable close');
        },
    });
}

export {
    permissionRequest
}