import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';
// import getUser from '../../utils/getUser';

const PrivateChatList = ({sendMessage, leaveFromPrivate, readMsg ,me}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (username) => {
        setActiveChat(username);
    }
    const addNewChat = useCallback((toUsername, unReadMsg, roomName) => {
        
        let privateChat = chatList.find((item) => (item.to === toUsername));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: toUsername, ref});
            let chatInfo = {to: toUsername, initVal: {messages: unReadMsg, roomName}};
            setChatList([...chatList, chatInfo]);
            setActiveChat(toUsername);
        }
        else {
            let ref = elRefs.current.find((item) => (item.key === toUsername));
            if(ref) {
                console.log('private show')
                ref.ref.current.show();
                setActiveChat(privateChat.to);
            }
        }
        readMsg(toUsername);
    }, )
    const deleteChat = useCallback((toUsername, roomName) => {
        let newChats = chatList.filter((item) => (item.to.username !== toUsername));
        let newRefs = elRefs.current.filter((item) => (item.key !== toUsername));
        elRefs.current = newRefs;
        setChatList(newChats);
        leaveFromPrivate(roomName);
    })
    useImperativeHandle(ref, () => ({
        addChat: (to, roomName) => {
            addNewChat(to.username, [], roomName);
        },
        addMessage: (message, roomName) => {
            let ref = elRefs.current.find((item) => (item.key === message.from || item.key === message.to));
            if(ref && ref.ref.current) {
                ref.ref.current.addMessage(message);
                if(ref.ref.current.isShow()) {
                    return true;
                } else {
                    ref.ref.current.show();
                    return false;
                }
            } else {
                console.log('add new chat', message.from, roomName)
                addNewChat(message.from, [message], roomName);
            }
            return false;
        }
    }));
    return (
        <>
            {chatList.map((item, index) =>
                <PrivateChatContent key={item.to.username}
                    ref={elRefs.current[index].ref}
                    me={me} to={item.to}
                    initMessages={item.initVal.messages}
                    sendMessage={sendMessage}
                    deleteChat={deleteChat}
                    active={item.to === activeChat}
                    setActive={setActive}
                    roomName={item.initVal.roomName}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;