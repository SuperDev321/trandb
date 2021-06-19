import React, { useState, useCallback, useImperativeHandle, forwardRef, useRef, createRef, useContext } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { SettingContext } from '../../../context';
const PrivateChatList = ({sendMessage, readMsg ,me, globalBlocks}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const {privateMutes} = useContext(SettingContext);
    const elRefs = useRef([]);
    const setActive = (roomName) => {
        setActiveChat(roomName);
    }
    const addNewChat = useCallback((to, unReadMsg, roomName, willShow = true) => {
        let privateChat = chatList.find((item) => (item.roomName === roomName));
        if(!privateChat && willShow) {
            let ref = createRef();
            elRefs.current.push({key: roomName, ref});
            let chatInfo = {to: to.username, ip: to.ip, roomName, initVal: {messages: unReadMsg, roomName}, avatar: to.avatar};
            setChatList([...chatList, chatInfo]);
            setActiveChat(roomName);
        }
        else {
            let ref = elRefs.current.find((item) => (item.key === roomName));
            if(ref && willShow) {
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
            let result = false
            if(ref && ref.ref.current) {
                result = ref.ref.current.addMessage(message);
                if(result && !ref.ref.current.isShow()) {
                    ref.ref.current.show();
                }
            } else {
                let muted = privateMutes.find(({username, ip}) => (username === message.from || ip === message.ip))
                if (muted) {
                    result = false
                } else {
                    result = true
                }
                addNewChat({username: message.from, ip: message.ip}, [message], roomName, result);
            }
            return result;
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