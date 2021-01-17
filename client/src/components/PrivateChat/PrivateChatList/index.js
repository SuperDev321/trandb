import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
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
        },
        addMessage: (message) => {

        }
    }));
    return (
        <>
            {chatList.map((item, index) => 
                <PrivateChatContent key={index}
                    messages={item.messages} me={item.me} to={item.to}
                    sendMessage={sendMessage}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;