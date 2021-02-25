import React, { useContext, useState, useRef, useEffect, memo } from 'react';
import ReactPlayer from 'react-player'
import ChatForm from '../ChatForm';
import {UserContext} from '../../context';
import MessagesList from '../Message/MessagesList';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import {
    Close,
    Remove
} from '@material-ui/icons'
// import {
//     InputBase,
//     IconButton,
//     Popper,
//     Grow,
//     ClickAwayListener,
//     CssBaseline,
// } from '@material-ui/core';
// import SendIcon from '@material-ui/icons/Send';
// import AddIcon from '@material-ui/icons/Add';
// import { Picker } from 'emoji-mart';
// import ChatLayout from '../ChatLayout';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        overflow: 'auto',
        position: 'relative'
    },
    youtube: {
        width: 290,
        height: 210,
        position: 'absolute',
        top: 10,
        right: 10
    },
    youtubeAction: {
        display: 'flex',
    },
    actionButton: {
        color: 'black'
    }
}))

const ChatRoom = ({roomName, users, messages, mutes, sendMessage, changeMuteState, sendPokeMessage, kickUser, banUser,
    addOrOpenPrivate}) => {
    const classes = useStyles();
    const { username } = useContext(UserContext);
    const [role, setRole] = useState(null)
    const [messagesToShow, setMessagesToShow] = useState([]);
    const [youtubeUrl, setYoutubeUrl] = useState(null);
    const [youtubeShow, setYoutubeShow] = useState(false)
    const closeYoutube = () => {
        setYoutubeUrl(null);
    }
    const userAction = (type, payload) => {
        if(type === 'show_link') {
            console.log('youtub')
            let url = payload.url;
            if(url) {
                if(payload.host === 'youtube.com' || payload.host === 'www.youtube.com' ) {
                    setYoutubeUrl(url)
                    setYoutubeShow(true)
                } else {
                    window.open(url, '_blank');
                }
            }
        }
    }
    const toggleYoutube = () => {
        setYoutubeShow(!youtubeShow);
    }
    useEffect(() => {
        let me = users.find((item) => (item.username === username));
        if(me) setRole(me.role);
    }, [users, username])

    useEffect(() => {
        // let mutedUsers = users.filter((user) => (user.muted));
        // let mutedUserNames = mutedUsers.map(({username}) => (username));
        let unMutedMessages = messages.filter(({from}) => (!((from) && (mutes.includes(from)))));
        setMessagesToShow(unMutedMessages);
    }, [messages, mutes])
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                {messagesToShow.length ?
                    <MessagesList
                        users={users}
                        mutes={mutes}
                        role={role}
                        roomName={roomName}
                        messages={messagesToShow}
                        changeMuteState={changeMuteState}
                        sendPokeMessage={sendPokeMessage}
                        kickUser={kickUser}
                        banUser={banUser}
                        addOrOpenPrivate={addOrOpenPrivate}
                        className={classes.messageArea} userAction={userAction} />
                    : <div></div>
                }
                <div className={classes.youtube}>
                    { youtubeUrl &&
                    <>
                    <ReactPlayer
                        url={youtubeUrl}
                        playing={youtubeShow}
                        width="100%"
                        height={youtubeShow? "100%": 0}
                        controls
                    />
                    <div className={classes.youtubeAction} >
                        <IconButton onClick={closeYoutube}
                            size="small" variant="contained" className={classes.actionButton}
                        >
                            <Close />
                        </IconButton>
                        <IconButton onClick={toggleYoutube}
                            size="small" className={classes.actionButton}
                        >
                            <Remove />
                        </IconButton>
                    </div>
                    </>
                    }
                </div>
            </div>
            <ChatForm username={username} roomName={roomName} type="public" sendMessage={sendMessage}/>
        </div>
    );
};

export default memo(ChatRoom);
