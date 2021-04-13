import React, { useState, useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PauseIcon from '@material-ui/icons/Pause';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import LockIcon from '@material-ui/icons/Lock';

import SeparateLine from '../SeparateLine';
import { UserContext } from '../../context';
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
        color: theme.palette.textColor.main
    }
}));

const useVideoStyles = makeStyles((theme) => ({
    root: {
        margin: 5
    },
    mediaContent: {
        width: 350,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        opacity: 0,
        '&:hover': {
            opacity: 1
        }
        
    },
    overlayHeader: {
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlayFooter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: '100%',
        lineHeight: 0
    },
    flexGrower: {
        flexGrow: 1
    },
    username: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 500,
    }
}));

// const LocalVideo = ({stream, locked}) => {
//     const userVideo = useRef();
//     const classes = useVideoStyles();
//     useEffect(() => {
//         if(stream && userVideo.current) {
//             userVideo.current.srcObject = stream;
//         }
//     }, [stream])

//     if(!stream) {
//         return null
//     }

//     return (
//         <div className={classes.root}>
//             <div className={classes.mediaContent}>
//                 <div className={classes.overlay}>
//                     <div className={classes.overlayHeader}>
//                         <div>
//                             <IconButton aria-label="delete" color="secondary" >
//                                 <CloseIcon />
//                             </IconButton>
//                         </div>
//                         <div className={classes.streamInfos}>
//                         { locked?
//                             <IconButton aria-label="lock" color="secondary" >
//                                 <LockIcon />
//                             </IconButton>
//                             :
//                             null
//                         }
//                         </div>
//                     </div>
//                     <div className={classes.flexGrower}></div>
//                     <div className={classes.overlayFooter}>
//                         <IconButton aria-label="pause" color="secondary">
//                             <PauseIcon />
//                         </IconButton>
//                     </div>
//                 </div>
//                 <div className={classes.content}>
//                     <video ref={userVideo} autoPlay style={{width: '100%'}} />
//                 </div>
                
//             </div>
//             <div className={classes.username}>
//                 {name}
//             </div>
//         </div>
        
//     )
// }

const UserVideo = ({stream, locked, name, controlVideo}) => {
    const userVideo = useRef();
    // const userAudio = useRef();
    const classes = useVideoStyles();
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if(userVideo.current) {
            userVideo.current.play();
        }
    }

    const handlePause = () => {
        if(userVideo.current) {
            userVideo.current.pause();
        }
    }

    useEffect(() => {
        if(stream && userVideo.current) {
            
            if(stream) {
                console.log('load new stream')
                userVideo.current.srcObject = stream;
                // userVideo.current.load();
                // userVideo.current.play();
            }
            userVideo.current.onerror = function() {
                console.log("Error streaming ref");
            }
            userVideo.current.onpause = function() {
                console.log('onpause')
                setPlaying(false);
            }

            userVideo.current.onplay = function() {
                console.log('onplay')
                setPlaying(true);
            }


            userVideo.current.oncanplay = function() {
                console.log('canplay event')
                var playPromise = userVideo.current.play();

                if (playPromise !== undefined) {
                    playPromise
                    .then(_ => {
                        // Automatic playback started!
                        // Show playing UI.
                        console.log("audio played auto");
                    })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                        console.log("playback prevented");
                    });
                }
            }
        }
        return () => {
            stream.getTracks().forEach((track) => {
                track.stop();
            })
        }
    }, [stream])
    
    return (
        <div className={classes.root}>
            <div className={classes.mediaContent}>
                <div className={classes.overlay}>
                    <div className={classes.overlayHeader}>
                        <div>
                            <IconButton aria-label="delete" color="secondary" >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className={classes.streamInfos}>
                        { locked?
                            <IconButton aria-label="lock" color="secondary" >
                                <LockIcon />
                            </IconButton>
                            :
                            null
                        }
                        </div>
                    </div>
                    <div className={classes.flexGrower}></div>
                    <div className={classes.overlayFooter}>
                    { playing?
                        <IconButton aria-label="pause" color="secondary" onClick={handlePause}>
                            <PauseIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="play" color="secondary" onClick={handlePlay}>
                            <PlayCircleFilledIcon />
                        </IconButton>
                    }
                    </div>
                </div>
                <div className={classes.content}>
                    <video ref={userVideo} autoPlay style={{width: '100%'}} >
                        <p>Any HTML content</p>
                    </video>
                    {/* <audio ref={userAudio} autoPlay /> */}
                </div>
                
            </div>
            <div className={classes.username}>
                {name}
            </div>
        </div>
    )
}

const VideoList = ({streams: remoteStreams, localStream, controlVideo}) => {
    const classes = useStyles();

    const locked = localStream?.locked;
    const stream = localStream?.stream;
    const {username} = useContext(UserContext);
    
    return (
        <div className={classes.root}>
        { localStream ?
            <UserVideo stream={stream} locked={locked} name={username} controls/>
            :null
        }
            <SeparateLine style={{width: '100%'}} />
            { remoteStreams?.map(({stream, name, locked}, index) => (
                    <UserVideo stream={stream} key={name} locked={locked} name={name} />
                ))
            }
        </div>
    )
}

export default VideoList;