import React, { useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {SettingContext} from '../../context';
import { HomeLayout } from '../../components';
// import { makeStyles } from '@material-ui/styles';
import {
    CssBaseline,
} from '@material-ui/core';
import ChatRooms from '../../components/ChatRooms';

const ChattingRoom = () => {
    const { room } = useParams();
    const {messageSize, setMessageSize} = useContext(SettingContext);
    // const [unReadMsgs, setUnReadMsgs] = useState([]) ;
    const chatRef = useRef();
    // const addUnReadMsg = ({from, msg}) => {
    //     let msgInfo = {
    //         from,
    //         msg,
    //     }
    //     setUnReadMsgs([...unReadMsgs, msgInfo]);
    // }
    // const readMsg = (from) => {
    //     let msgs = unReadMsgs.filter((item) => (item.from !== from));
    //     setUnReadMsgs(msgs)
    // }
    const openPrivate = (user) => {
        chatRef.current.openPrivate(user);
    }
    return (
        <HomeLayout messageSize={messageSize} setMessageSize={setMessageSize}>
            <CssBaseline />
            <ChatRooms ref={chatRef} room={room}
            // addUnReadMsg={addUnReadMsg}
            //  readMsg={readMsg}
            />
        </HomeLayout>
    );
};

export default ChattingRoom;
