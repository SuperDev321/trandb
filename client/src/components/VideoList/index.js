import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PauseIcon from '@material-ui/icons/Pause';
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: '#00000017',
            outline: 'none',
            borderRadius: '5px',
        },
        background: 'rgba(0, 0, 0, 0.04)',
        boxShadow: '1px 1px 6px 0px rgb(0 0 0 / 20%)',
    }
}));

const useVideoStyles = makeStyles((theme) => ({
    root: {
        width: 350,
        position: 'relative',
    },
    actionField: {
        position: 'absolute',
        padding: 5,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        opacity: 0,
        '&:hover': {
            opacity: 1
        }
    },
    actionFooter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {

    },
    flexGrower: {
        flexGrow: 1
    }
}));

const LocalVideo = ({stream}) => {
    const userVideo = useRef();
    const classes = useVideoStyles();
    useEffect(() => {
        if(stream && userVideo.current) {
            userVideo.current.srcObject = stream;
        }
    }, [stream])
    return (
        <div className={classes.root}>
            <div className={classes.actionField}>
                <div className={classes.actionHeader}>
                    <IconButton aria-label="delete" color="secondary" >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={classes.flexGrower}></div>
                <div className={classes.actionFooter}>
                    <IconButton aria-label="pause" color="secondary">
                        <PauseIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.content}>
                <video ref={userVideo} autoPlay style={{width: '100%', padding: '5px'}} />
            </div>
            
        </div>
        
    )
}

const UserVideo = ({streamSet, controlVideo}) => {
    const userVideo = useRef();
    const userAudio = useRef();
    const classes = useVideoStyles();
    useEffect(() => {
        if(streamSet && userVideo.current) {
            if(streamSet.audio) {
                userAudio.current.srcObject = streamSet.audio;
            }
            if(streamSet.video) {
                userVideo.current.srcObject = streamSet.video;
            }
            // console.log('user stream', stream);
        }
    }, [streamSet])
    return (
        <div className={classes.root}>
            <div className={classes.actionField}>
                <div className={classes.actionHeader}>
                    <IconButton aria-label="delete" color="secondary" >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className={classes.flexGrower}></div>
                <div className={classes.actionFooter}>
                    <IconButton aria-label="pause" color="secondary">
                        <PauseIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.content}>
                <video ref={userVideo} autoPlay  style={{width: '100%', padding: '5px'}} />
                <audio ref={userAudio} autoPlay />
            </div>
            
        </div>
        
    )
}

const VideoList = ({streams, localStream, controlVideo}) => {
    const classes = useStyles();
    console.log('remotestreams', streams)

    return (
        <div className={classes.root}>{
            localStream?
             <LocalVideo stream={localStream} /> : null
        }
        { streams?.map(({streamSet}, index) => (
                <UserVideo streamSet={streamSet} key={index}/>
            ))
        }
        </div>
    )
}

export default VideoList;