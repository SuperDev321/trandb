import React from 'react';
import { useParams } from 'react-router-dom';

import { HomeLayout } from '../../components';
// import { makeStyles } from '@material-ui/styles';
import {
    CssBaseline,
} from '@material-ui/core';
import ChatRooms from '../../components/ChatRooms';

// const socket = io({
//   autoConnect: false,
// });

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         height: '100%',
//         position: 'relative'
//     },
//     messageArea: {
//         flex: 1
//     },
//     inputArea: {
//         borderRadius: '0px',
//         display: 'flex',
//         height: 'fit-content',
//         boxShadow: '1px 1px 20px 14px rgb(0 0 0 / 23%), 0px 1px 1px 0px rgba(0,0,0,0.14)',
//         zIndex: '10',
//     },
//     inputForm: {
//         display: 'flex',
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',

//     },
//     formActionArea: {
//         display: 'flex',
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'flex-end'
//     },
//     formActions: {
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     textArea: {
//         flex: 1,
//         paddingLeft: '20px',
//         paddingRight: '20px',
//         fontSize: '25px',
//     },
//     sendButton: {
//         color: theme.palette.primary.main,
//     },
//     emojiArea: {
//         '& button, span': {
//             outline: 'none'
//         },
//         zIndex: '200'
//     }
// }))



const ChattingRoom = () => {
    const { room } = useParams();
    console.log(room)
    return (
        <HomeLayout>
            <CssBaseline />
            <ChatRooms room={room}/>
        </HomeLayout>
    );
};

export default ChattingRoom;
