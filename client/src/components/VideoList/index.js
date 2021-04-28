import React, { useState, useEffect, useRef, useContext, useCallback, useReducer } from 'react';
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
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Loading from '../Loading';

const VideoFieldWidth = 350;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        height: 'calc(100vh - 49px)',
        // alignItems: 'center',
        // flexDirection: 'column',
        scrollbarWidth: 0,
        minWidth: `${VideoFieldWidth+2}px !important`,
        width: `${VideoFieldWidth+2}px !important`,
        scrollbarColor: `#585B5E #ecdbdb00`,
        '&::-webkit-scrollbar': {
            width: 0,
        },
        // '&::-webkit-scrollbar-track': {
        //     '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        // },
        // '&:hover::-webkit-scrollbar-thumb': {
        //     backgroundColor: '#00000017',
        //     outline: 'none',
        //     borderRadius: '5px',
        // },
        background: theme.palette.background.default,
        boxShadow: '1px 1px 6px 0px rgb(0 0 0 / 20%)',
        color: theme.palette.textColor.main,
        overflowY: 'auto',
        border: '1px solid',
        borderColor: theme.palette.separate.main
    }
}));

const useVideoStyles = makeStyles((theme) => ({
    root: {
        padding: 2,
        width: props => {
            if(props.zoom) {
                return VideoFieldWidth;
            }
            if(props.total && props.num) {
                switch(props.total) {
                    case 1:
                    case 2:
                        return VideoFieldWidth - 2;
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return VideoFieldWidth /2 - 2;
                    default:
                        return VideoFieldWidth/3 - 2;
                }
            } else {
                return VideoFieldWidth
            }
        },
    },
    mediaContent: {
        position: 'relative',
        border: '1px solid',
        borderColor: theme.palette.separate.main
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        opacity: 0,
        background: 'rgba(71, 71, 71, 0.329)',
        '&:hover': {
            opacity: 1,
        },
        
    },
    overlayHeader: {
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlayFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        direction: 'ltr'
    },
    content: {
        width: '100%',
        lineHeight: 0,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
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
        zIndex: 11,
        background: 'rgba(71, 71, 71, 0.329)',
        
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

const UserVideo = ({stream, locked, name, controlVideo, muted, total, streamNum, zoom}) => {
    const userVideo = useRef();
    // const userAudio = useRef();
    const classes = useVideoStyles({total, num: streamNum, zoom});
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

    const handleZoom = (type) => {
        if(type) {
            // zoom out
            controlVideo({
                type: 'zoomOut',
                name
            })
        } else {
            // zoom in
            controlVideo({
                type: 'zoomIn',
                name
            })
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
                    { zoom?
                        <IconButton aria-label="pause" className={classes.iconButton} onClick={() => handleZoom(false)}>
                            <ZoomOutIcon font="small" />
                        </IconButton>
                        :
                        <IconButton aria-label="play" className={classes.iconButton} onClick={() => handleZoom(true)}>
                            <ZoomInIcon />
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

function asyncReducer(state, action) {
    switch (action.type) {
        case 'pending': {
            return {status: 'pending', data: null, error: null}
        }
        case 'resolved': {
            return {status: 'resolved', data: action.data, error: null}
        }
        case 'rejected': {
            return {status: 'rejected', data: null, error: action.error}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const VideoList = ({streams: remoteStreams, localStream, controlVideo}) => {
    const classes = useStyles();

    // const locked = localStream?.locked;
    // const stream = localStream?.stream;
    const {username} = useContext(UserContext);
    const [zoom, setZoom] = useState(null);

    const [state, dispatch] = React.useReducer(asyncReducer, {
        status: 'idle',
        data: null,
        error: null,
    })

    useEffect(() => {
        let streams = null;
        
        if(localStream) {
            dispatch({type: 'pending'})
            streams = [{...localStream, name: username, muted: true},...remoteStreams]
        } else {
            if(remoteStreams) {
                dispatch({type: 'pending'})
                streams = [...remoteStreams];
            } else {
                return;
            }
        }
        if(zoom) {
            let zoomStream = streams.find(({name}) => (name === zoom));
            if(zoomStream) {
                let unZoomStreams = streams.filter(({name}) => (name !== zoom));
                streams = [{...zoomStream, zoom: true}, ...unZoomStreams];
            }
        }
        if(streams) {
            dispatch({type: 'resolved', data: streams})
            console.log(streams);
        }
    }, [localStream, remoteStreams, zoom])

    const handleVideo = (payload) => {
        let {type, name} = payload;
        switch(type) {
            case 'zoomIn':
                if(name) {
                    if(zoom === name)
                        setZoom(null);
                }
                break;
            case 'zoomOut':
                if(name) {
                    console.log('zoom out', name)
                    if(zoom !== name)
                        setZoom(name);
                }
                break;
            case 'close':
                if(name) {
                    controlVideo(payload);
                }
                break;
            default:
                break;
        }
    }

    const {data: streams, status, error} = state;

    if(status === 'idle') {
        return null;
    }

    if((!streams)||streams.length === 0 ) return null;
    
    return (
        <div className={classes.root}>
        { status === 'pending' ?
            <Loading/>
        :
            streams?.map(({stream, name, locked, zoom, muted}, index) => (
                <UserVideo
                    stream={stream} key={index} locked={locked} name={name}
                    controlVideo={handleVideo}
                    total={streams.length}
                    zoom={zoom}
                    muted={muted}
                    streamNum = {1+index}
                />
            ))
        }
        </div>
    )
}

export default VideoList;