import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { HomeLayout } from '../../components';
// import { makeStyles } from '@material-ui/styles';
import {
    CssBaseline,
} from '@material-ui/core';
import ChatRooms from '../../components/ChatRooms';

const ChattingRoom = () => {
    const { room } = useParams();
    const [unReadMsgs, setUnReadMsgs] = useState([]);
    const chatRef = useRef();
    const addUnReadMsg = ({from, msg}) => {
        let msgInfo = {
            from,
            msg,
        }
        setUnReadMsgs([...unReadMsgs, msgInfo]);
    }
    // const readMsg = (from) => {
    //     let msgs = unReadMsgs.filter((item) => (item.from !== from));
    //     setUnReadMsgs(msgs)
    // }
    const openPrivate = (user) => {
        chatRef.current.openPrivate(user);
    }
    return (
        <HomeLayout unReadMsgs={unReadMsgs} openPrivate={openPrivate}>
            <CssBaseline />
            <ChatRooms ref={chatRef} room={room} addUnReadMsg={addUnReadMsg}
            //  readMsg={readMsg}
            />
        </HomeLayout>
    );
};

export default ChattingRoom;
