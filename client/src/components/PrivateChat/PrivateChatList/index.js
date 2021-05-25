import React, { useState, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';

const PrivateChatList = ({sendMessage, readMsg ,me, globalBlocks}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (roomName) => {
        setActiveChat(roomName);
    }
    const addNewChat = useCallback((to, unReadMsg, roomName) => {
        let privateChat = chatList.find((item) => (item.roomName === roomName));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: roomName, ref});
            let chatInfo = {to: to.username, ip: to.ip, roomName, initVal: {messages: unReadMsg, roomName}, avatar: to.avatar};
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
    }, [chatList])

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
    }, [chatList, setChatList])
    useImperativeHandle(ref, () => ({
        getPrivateRooms: () => {
            let rooms = chatList.map((item) => (item.roomName));
            return rooms;
        },
        addChat: (to, roomName) => {
            addNewChat(to, [], roomName);
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
                addNewChat({username: message.from, ip: message.ip}, [message], roomName);
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
                <PrivateChatContent key={item.roomName}
                    ref={elRefs.current[index].ref}
                    me={me} to={item.to}
                    ip={item.ip}
                    avatar={item.avatar}
                    initMessages={item.initVal.messages}
                    sendMessage={sendMessage}
                    deleteChat={deleteChat}
                    active={item.roomName === activeChat}
                    setActive={setActive}
                    roomName={item.roomName}
                    globalBlocks={globalBlocks}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;