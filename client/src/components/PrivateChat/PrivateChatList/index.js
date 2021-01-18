import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';

const PrivateChatList = ({sendMessage}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (username) => {
        setActiveChat(username);
    }
    const addNewChat = useCallback((chatInfo) => {
        let privateChat = chatList.find((item) => (item.to.username === chatInfo.to.username));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: chatInfo.to.username, ref});
            setChatList([...chatList, chatInfo]);
            setActiveChat(chatInfo.to.username);
        }
        else {
            let ref = elRefs.current.find((item) => (item.key === privateChat.to.username));
            if(ref) ref.ref.current.show();
        }
    }, )
    useImperativeHandle(ref, () => ({
        addChat: (chatInfo) => {
            addNewChat(chatInfo);
        },
        addMessage: (message) => {
            console.log('new private message', message)
            let ref = elRefs.current.find((item) => (item.key === message.from || item.key === message.to));
            if(ref) {
                ref.ref.current.addMessage(message);
            }
        }
    }));
    return (
        <>
            {chatList.map((item, index) =>
                <PrivateChatContent key={index}
                    ref={elRefs.current[index].ref}
                    me={item.me} to={item.to}
                    sendMessage={sendMessage}
                    active={item.to.username === activeChat}
                    setActive={setActive}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;