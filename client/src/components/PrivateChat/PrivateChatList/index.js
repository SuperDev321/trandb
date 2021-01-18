import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    }
}))
const PrivateChatList = ({sendMessage}, ref) => {
    const [chatList, setChatList] = useState([]);
    const classes = useStyles();
    const addNewChat = useCallback((chatInfo) => {
        let toNames = chatList.map((item) => (item.to.username));
        if(!toNames.includes(chatInfo.to.username))
            setChatList([...chatList, chatInfo])
        else {

        }
    }, )
    useImperativeHandle(ref, () => ({
        addChat: (chatInfo) => {
            addNewChat(chatInfo);
        }
    }));
    return (
        <div className={classes.root}>
            {chatList.map((item, index) => 
                <PrivateChatContent key={index}
                    messages={item.messages} me={item.me} to={item.to}
                    sendMessage={sendMessage}
                />
            )
            }
        </div>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;