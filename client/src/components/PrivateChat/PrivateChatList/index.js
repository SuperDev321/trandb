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
                ref.ref.current.show();
                setActiveChat(roomName);
            }
        }
    }, )

    const openChat = (toUsername) => {
        let chatInfo = chatList.find((item) => (item.to === toUsername));
        if(chatInfo) {
            let ref = elRefs.current.find((item) => (item.key === chatInfo.roomName));
            if(ref) {
                ref.ref.current.show();
                setActiveChat(chatInfo.roomName);
                return true;
            }
        }
        return false;
    }
    const deleteChat = useCallback((toUsername, roomName) => {
        let newChats = chatList.filter((item) => (item.roomName !== roomName));
        let newRefs = elRefs.current.filter((item) => (item.key !== roomName));
        elRefs.current = newRefs;
        setChatList(newChats);
        // leaveFromPrivate(roomName);
    })
    useImperativeHandle(ref, () => ({
        getPrivateRooms: () => {
            let rooms = chatList.map((item) => (item.roomName));
            return rooms;
        },
        addChat: (to, roomName) => {
            addNewChat(to.username, [], roomName);
        },
        openChat: (to) => {
            return openChat(to.username);
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