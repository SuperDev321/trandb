import React, { useContext, useState, useRef, useEffect, memo } from 'react';
import ReactPlayer from 'react-player'
import ChatForm from '../ChatForm';
import {UserContext} from '../../context';
import MessagesList from '../Message/MessagesList';
import SeparateLine from '../SeparateLine';
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
        // width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexGrow: 1,
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
        color: theme.palette.textColor.main
    }
}))

const ChatRoom = ({roomName, users, messages, mutes, blocks, globalBlocks, sendMessage, changeMuteState, sendPokeMessage, kickUser, banUser,
    addOrOpenPrivate}) => {
    const classes = useStyles();
    const { username } = useContext(UserContext);
    const [blocked, setBlocked] = useState(false);
    const [role, setRole] = useState(null)
    const [messagesToShow, setMessagesToShow] = useState([]);
    const [youtubeUrl, setYoutubeUrl] = useState(null);
    const [youtubeShow, setYoutubeShow] = useState(false)
    const closeYoutube = () => {
        setYoutubeUrl(null);
    }
    const userAction = (type, payload) => {
        if(type === 'show_link') {
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
        let blockedNames = blocks.map((item) => ((item && item.username)? item.username: null));
        let globalBlockedNames = globalBlocks.map((item) => ((item && item.username)? item.username: null));
        blockedNames = [...blockedNames, ...globalBlockedNames];

        let blockedIps = blocks.map((item) => ((item && item.ip)? item.username: null));
        let globalBlockedIps = globalBlocks.map((item) => ((item && item.ip)? item.ip: null));
        blockedIps = [...blockedIps, ...globalBlockedIps];

        let mutedNames = mutes.map((item) => ((item && item.username)? item.username: null));
        let mutedIps = mutes.map((item) => ((item && item.ip)? item.ip: null));

        if(Array.isArray(messages)) {
            let unMutedMessages = messages.filter(({from, ip}) => {
                if(!from) {
                    return true;
                }
                
                if(ip && blockedIps.includes(ip)) {
                    return false;
                }
                
                if(blockedNames.includes(from)) {
                    return false;
                }
                if(mutedNames.includes(from)) {
                    return false;
                }
                if(mutedIps.includes(ip)) {
                    return false;
                }
                
                return true;
            });
            setMessagesToShow(unMutedMessages);
        }
    }, [messages, mutes, blocks, globalBlocks])
    useEffect(() => {
        if(blocks && blocks.includes(username)) {
            setBlocked(true);
        } else if(globalBlocks && globalBlocks.includes(username)) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
        
    }, [blocks, globalBlocks, username]);
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
                }{ youtubeUrl ?
                <div className={classes.youtube}>
                    
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
                    </div>: null
                }
            </div>
            <SeparateLine />
            <ChatForm username={username} blocked={blocked} roomName={roomName} type="public" sendMessage={sendMessage}/>
            <SeparateLine />
        </div>
    );
};

export default memo(ChatRoom);
