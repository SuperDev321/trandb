import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';

const PrivateChatList = ({sendMessage, readMsg ,me}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (username) => {
        setActiveChat(username);
    }
    const addNewChat = useCallback((to) => {
        
        let privateChat = chatList.find((item) => (item.to.username === to.username));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: to.username, ref});
            let chatInfo = {
                to,
                me,
            }
            setChatList([...chatList, chatInfo]);
            setActiveChat(to.username);
        }
        else {
            let ref = elRefs.current.find((item) => (item.key === privateChat.to.username));
            if(ref) {
                ref.ref.current.show();
                setActiveChat(privateChat.to.username);
            }
        }
        readMsg(to.username);
    }, )
    useImperativeHandle(ref, () => ({
        addChat: (chatInfo) => {
            addNewChat(chatInfo);
        },
        addMessage: (message) => {
            let ref = elRefs.current.find((item) => (item.key === message.from || item.key === message.to));
            if(ref) {
                ref.ref.current.addMessage(message);
                if(ref.ref.current.isShow()) {
                    return true;
                }
            }
            return false;
        }
    }));
    return (
        <>
            {chatList.map((item, index) =>
                <PrivateChatContent key={index}
                    ref={elRefs.current[index].ref}
                    me={me} to={item.to}
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