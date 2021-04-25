import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
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

import useAnalysis from './useAnalysis';
import SoundMeter from './SoundMeter';
import VolumnControl from './VolumnControl';

const VideoFieldWidth = 350;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        // alignItems: 'center',
        // flexDirection: 'column',
        scrollbarWidth: 'thin',
        scrollbarColor: `#585B5E #ecdbdb00`,
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
        background: '#f5f5f5',
        boxShadow: '1px 1px 6px 0px rgb(0 0 0 / 20%)',
        color: theme.palette.textColor.main,
        overflowY: 'auto',
        width: `${VideoFieldWidth}px !important`,


    }
}));

const useVideoStyles = makeStyles((theme) => ({
    root: {
        padding: 5,
        width: props => {
            if(props.total && props.num) {
                switch(props.total) {
                    case 1:
                    case 2:
                        return VideoFieldWidth;
                    case 3:
                        if(props.num === 1) {
                            return VideoFieldWidth;
                        } else {
                            return VideoFieldWidth /2;
                        }
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return VideoFieldWidth /2;
                    default:
                        return VideoFieldWidth/3;
                }
            } else {
                return VideoFieldWidth
            }
        },
    },
    mediaContent: {
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
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    content: {
        width: '100%',
        lineHeight: 0,
        display: 'flex',
        position: 'relative'
    },
    flexGrower: {
        flexGrow: 1
    },
    username: {
        position: 'absolute',
        top: 5,
        left: 5,
        // display: 'flex',
        // justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#f5f5f5',
        background: 'rgba(71, 71, 71, 0.329)'
    },
    iconButton: {
        color: '#f5f5f5'
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

const UserVideo = ({stream, locked, name, controlVideo, muted, total, streamNum}) => {
    const userVideo = useRef();
    // const userAudio = useRef();
    const classes = useVideoStyles({total, num: streamNum});
    const [playing, setPlaying] = useState(false);
    const {data} = useAnalysis(stream);
    const [volume, setVolume] = useState(0);

    const echo = data*volume/100;
 
    const handlePlay = () => {
        if(userVideo.current) {
            userVideo.current.play();
            console.log(userVideo.current.volume)
            setVolume(userVideo.current.volume*100)
        }
    }

    const handlePause = () => {
        if(userVideo.current) {
            userVideo.current.pause();
        }
    }
    const handleClose = () => {
        let data = {
            type: 'close',
            name
        }
        controlVideo(data);
    }

    const handleChangeVolume = (event, newValue) => {
        setVolume(newValue);
        if(userVideo.current) {
            userVideo.current.volume = newValue/100;
        }
    }

    useEffect(() => {
        if(stream && userVideo.current) {
            
            if(stream) {
                userVideo.current.srcObject = stream;
                // userVideo.current.load();
                // userVideo.current.play();
            }
            userVideo.current.onerror = () => {
                console.log("Error streaming ref");
            }
            userVideo.current.onpause = () => {
                setPlaying(false);
            }

            userVideo.current.onplay = () => {
                setPlaying(true);
            }


            userVideo.current.oncanplay = () => {
                var playPromise = userVideo.current?.play();
                
                if (playPromise !== undefined) {
                    playPromise
                    .then(_ => {
                        setVolume(userVideo.current.volume*100);
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
    }, [stream])
    
    return (
        <div className={classes.root}>
            <div className={classes.mediaContent}>
                <div className={classes.overlay}>
                    <div className={classes.overlayHeader}>
                        <div>
                            <IconButton aria-label="delete" className={classes.iconButton} onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className={classes.streamInfos}>
                        {/* { locked?
                            <IconButton aria-label="lock" className={classes.iconButton} >
                                <LockIcon />
                            </IconButton>
                            :
                            null
                        } */}
                        </div>
                    </div>
                    <div className={classes.flexGrower}></div>
                    <div className={classes.overlayFooter}>
                    { playing?
                        <IconButton aria-label="pause" className={classes.iconButton} onClick={handlePause}>
                            <PauseIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="play" className={classes.iconButton} onClick={handlePlay}>
                            <PlayCircleFilledIcon />
                        </IconButton>
                    }
                        <VolumnControl value={volume} handleChange={handleChangeVolume} />
                    </div>
                </div>
                <div className={classes.content}>
                    <video ref={userVideo} autoPlay style={{width: '100%'}} muted={muted}>
                    </video>
                    {/* <audio ref={userAudio} autoPlay /> */}
                    <SoundMeter size={echo} />
                </div>
                <div className={classes.username}>
                    {name}
                </div>
            </div>
            
        </div>
    )
}

const VideoList = ({streams: remoteStreams, localStream, controlVideo}) => {
    const classes = useStyles();

    const locked = localStream?.locked;
    const stream = localStream?.stream;
    const {username} = useContext(UserContext);

    const streamLength = useCallback(() => {
        let len = 0;
        if(remoteStreams) {
            len += remoteStreams.length;
        }
        if(localStream) {
            len ++;
        }
        return len;
    }, [remoteStreams, localStream]);

    if(!streamLength()) return null;
    
    return (
        <div className={classes.root}>
        { localStream ?
            <UserVideo stream={stream}
                locked={locked} name={username} controls controlVideo={controlVideo} muted
                total={streamLength()}
                streamNum = {1}
            />
            :null
        }
            {/* <SeparateLine style={{width: '100%'}} /> */}
            { remoteStreams?.map(({stream, name, locked}, index) => (
                    <UserVideo
                        stream={stream} key={index} locked={locked} name={name}
                        controlVideo={controlVideo}
                        total={streamLength()}
                        streamNum = {localStream? 2+index: 1+index}
                    />
                ))
            }
        </div>
    )
}

export default VideoList;