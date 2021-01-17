import React, { memo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Paper,
    Box,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ChatForm from '../../ChatForm';
import Draggable from 'react-draggable';
import PrivateMessageList from '../../PrivateMessageList';
import { getSocket } from '../../../utils';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 2000,
        width: 400,
        height: 350,
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        height: 45,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 7px',
        boxShadow: '1px 1px 11px 1px rgb(0 0 0 / 19%), 0px 0px 0px 0px rgb(0 0 0)',
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    headerContent: {
        cursor: 'move',
        userSelect: 'none',
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 1
    },
    smallAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginLeft: 10,
    },
    content: {
        height: 250,
        width: '100%',
        overflow: 'auto',
        flexGrow: 1,
    }
}));

const PrivateChat = ({ messages, me, to, sendMessage}) => {
    const classes = useStyles();
    return (
        <Draggable bounds="parent" handle='#private-header' scale={1} grid={[5, 5]}
        >
            <Paper className={classes.root}>
                <div className={classes.header} >
                    <Avatar className={classes.smallAvatar}
                        src='/img/default_avatar.png'
                    />
                    <div id="private-header" className={classes.headerContent}>{to.username}</div>
                    <IconButton color='inherit' size='small'
                        // onClick={()=>{console.log('set false');setOpen(false)}}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={classes.content}>
                    <PrivateMessageList messages={messages} me={me}/>
                </div>
                <ChatForm to={to.username} sendMessage={sendMessage}/>
            </Paper>
        </Draggable>
    );
}

export default memo(PrivateChat);