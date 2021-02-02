import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';
// import getUser from '../../utils/getUser';

const PrivateChatList = ({sendMessage, readMsg ,me}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (roomName) => {
        setActiveChat(roomName);
    }
    const addNewChat = useCallback((toUsername, unReadMsg, roomName) => {
        
        let privateChat = chatList.find((item) => (item.roomName === roomName));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: roomName, ref});
            let chatInfo = {to: toUsername, roomName, initVal: {messages: unReadMsg, roomName}};
            setChatList([...chatList, chatInfo]);
            setActiveChat(roomName);
        }
        else {
            let ref = elRefs.current.find((item) => (item.key === roomName));
            if(ref) {
                console.log('private show')
                ref.ref.current.show();
                setActiveChat(roomName);
            }
        }
    }, )
    const deleteChat = useCallback((toUsername, roomName) => {
        let newChats = chatList.filter((item) => (item.roomName !== roomName));
        let newRefs = elRefs.current.filter((item) => (item.key !== roomName));
        elRefs.current = newRefs;
        setChatList(newChats);
        // leaveFromPrivate(roomName);
    })
    useImperativeHandle(ref, () => ({
        addChat: (to, roomName) => {
            addNewChat(to.username, [], roomName);
        },
        addMessage: (message, roomName) => {
            let ref = elRefs.current.find((item) => (item.key === roomName));
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
        },
        addErrorMessage: (roomName) => {
            let ref = elRefs.current.find((item) => (item.key === roomName));
            if(ref && ref.ref.current) {
                ref.ref.current.addErrorMessage();
            }
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
                    active={item.roomName === activeChat}
                    setActive={setActive}
                    roomName={item.roomName}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;