import React, { useContext, useState, useRef, useEffect, memo } from 'react';
import io from 'socket.io-client';
import ChatForm from '../ChatForm';
import UserContext from '../../context';
import MessagesList from '../Message/MessagesList';
import { makeStyles } from '@material-ui/styles';
// import {
//     InputBase,
//     IconButton,
//     Popper,
//     Grow,
//     ClickAwayListener,
//     CssBaseline,
// } from '@material-ui/core';
// import SendIcon from '@material-ui/icons/Send';
// import AddIcon from '@material-ui/icons/Add';
// import { Picker } from 'emoji-mart';
// import ChatLayout from '../ChatLayout';

const socket = io({
  autoConnect: false,
});

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
    },
}))

const ChatRoom = ({roomName, users, messages, sendMessage}) => {
    const classes = useStyles();
    const { username } = useContext(UserContext);
    const [messagesToShow, setmMssagesToShow] = useState([]);
    useEffect(() => {
        let mutedUsers = users.filter((user) => (user.muted));
        let mutedUserNames = mutedUsers.map(({username}) => (username));
        let unMutedMessages = messages.filter(({from}) => (!((from) && (mutedUserNames.includes(from)))));
        setmMssagesToShow(unMutedMessages);
    }, [messages, users])
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <MessagesList messages={messagesToShow} className={classes.messageArea} />
            </div>
            <ChatForm username={username} roomName={roomName} sendMessage={sendMessage}/>
        </div>
    );
};

export default memo(ChatRoom);
