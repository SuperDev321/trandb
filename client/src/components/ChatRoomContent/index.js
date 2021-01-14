import React, { useContext, useState, useRef } from 'react';
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

const ChatRoom = ({room}) => {
    const classes = useStyles();
    const { username } = useContext(UserContext);
    const [users, setUsers] = useState(null);
    const [msg, setMsg] = useState('');
    const [open, setOpen] = React.useState(false);

    const onFinish = (e) => {
        e.preventDefault();
        let realMsg = msg.trim();
        if (realMsg) {
            const date = Date.now();
            socket.emit('msg', { type: 'public', msg: realMsg, room, username, date });
            setMsg('');
        }
    };

    // if (!users) return <Spin className="chatting__spinner" />;

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <MessagesList messages={room && room.messages} className={classes.messageArea} />
            </div>
            <ChatForm username={username} room={room} />
        </div>
    );
};

export default ChatRoom;
