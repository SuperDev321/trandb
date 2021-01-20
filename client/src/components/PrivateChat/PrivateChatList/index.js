import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef, createRef } from 'react';
import PrivateChatContent from '../PrivateChatContent';
import { makeStyles } from '@material-ui/core/styles';
// import getUser from '../../utils/getUser';

const PrivateChatList = ({sendMessage, readMsg ,me}, ref) => {
    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const elRefs = useRef([]);
    const setActive = (username) => {
        setActiveChat(username);
    }
    const addNewChat = useCallback((toUsername, unRead) => {
        
        let privateChat = chatList.find((item) => (item.to === toUsername));
        if(!privateChat) {
            let ref = createRef();
            elRefs.current.push({key: toUsername, ref});
            let chatInfo = {to: toUsername, initVal: unRead};
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
    useImperativeHandle(ref, () => ({
        addChat: (to) => {
            addNewChat(to.username, 0);
        },
        addMessage: (message) => {
            let ref = elRefs.current.find((item) => (item.key === message.from || item.key === message.to));
            if(ref) {
                ref.ref.current.addMessage(message);
                if(ref.ref.current.isShow()) {
                    return true;
                } else {
                    ref.ref.current.show();
                    return false;
                }
            } else {
                addNewChat(message.from, 1);
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
                    initVal={item.initVal}
                    sendMessage={sendMessage}
                    active={item.to === activeChat}
                    setActive={setActive}
                />
            )
            }
        </>
    )
}

const PrivateChatListWithRef = forwardRef(PrivateChatList);

export default PrivateChatListWithRef;