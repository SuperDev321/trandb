import React, { useState, useEffect, useRef, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    IconButton
} from '@material-ui/core';
import {
    Close,
    Visibility,
    Mic,
    MicOff,
    Videocam,
    VideocamOff
} from '@material-ui/icons';
import { UserContext } from '../../context';
import useAnalysis from './useAnalysis';
import SoundMeter from './SoundMeter';
import VolumnControl from './VolumnControl';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Loading from '../Loading';
import { HashLoader } from 'react-spinners';

const VideoFieldWidth = 380;
const VideoFieldHeight = 288;

const override = {
    display: 'block !important',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
};

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
                return VideoFieldWidth - 2;
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
                return VideoFieldWidth - 2
            }
        },
        height: props => {
            if(props.zoom) {
                return VideoFieldHeight - 2;
            }
            if(props.total && props.num) {
                switch(props.total) {
                    case 1:
                    case 2:
                        return VideoFieldHeight - 2;
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return VideoFieldHeight /2 - 2;
                    default:
                        return VideoFieldHeight/3 - 2;
                }
            } else {
                return VideoFieldHeight - 2
            }
        },
        overflow: 'hidden'
    },
    mediaContent: {
        width: '100%',
        height: '100%',
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
        direction: 'ltr',
        flexWrap: 'wrap'
    },
    content: {
        width: '100%',
        lineHeight: 0,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5,
        '&:hover': {
            opacity: 1,
        },
        background: 'black',
        justifyContent: 'center'
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
    counts: {
        position: 'absolute',
        top: 25,
        left: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
//                                 <Close />
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

const UserVideo = ({ stream, locked, name, controlVideo, muted, total,
    streamNum, zoom, viewerCounts, isLocal, videoState, audioState
}) => {
    const userVideo = useRef();
    const classes = useVideoStyles({total, num: streamNum, zoom});
    const [playing, setPlaying] = useState(false);
    const {data} = useAnalysis({stream});
    const [volume, setVolume] = useState(0);
    const audioTrackRef = useRef(null);
    const [loading, setLoading] = useState(true);
    // const [audioState, setAudioState] = useState(true);
    // const [videoState, setVideoState] = useState(true);

    const echo = data*volume/100;
 
    const handlePlay = () => {
        if(userVideo.current) {
            userVideo.current.play();
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

    const changeMute = (kind, state) => {
        let data = {
            type: state? 'resume' : 'pause',
            kind,
            name
        }
        controlVideo(data)
    }

    const handleClose = () => {
        let data = {
            type: 'close',
            name
        }
        controlVideo(data);
    }

    const changeVolume = (newValue) => {
        setVolume(newValue);
        if(userVideo.current) {
            userVideo.current.volume = newValue/100;
        }
    }

    useEffect(() => {
        const videoObj = userVideo.current;
        if(stream && userVideo.current) {
            let audioTrack = stream.getAudioTracks()[0];
            let videoTrack = stream.getVideoTracks()[0];
            let initVolume = null
            if (audioTrack) {
                audioTrackRef.current = audioTrack
                if (typeof audioTrack.volume === 'number')
                    initVolume = audioTrack.volume
            }
            
            if(stream) {
                userVideo.current.srcObject = stream;
                if(typeof initVolume !== 'number') {
                    initVolume = 50;
                }
                changeVolume(initVolume);
            }
            userVideo.current.onerror = () => {
            }
            userVideo.current.onpause = () => {
                setPlaying(false);
            }

            userVideo.current.onplay = () => {
                setPlaying(true);
                if (loading) {
                    setLoading(false);
                }
            }

            userVideo.current.oncanplay = () => {
                var playPromise = userVideo.current?.play();
                
                if (playPromise !== undefined) {
                    playPromise
                    .then(_ => {
                        changeVolume(initVolume);
                        if (loading) {
                            setLoading(false);
                        }
                        // Automatic playback started!
                        // Show playing UI.
                    })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
                }
            }
        }
    }, [stream])

    useEffect(() => {
        return () => {
            if(audioTrackRef.current) {
                audioTrackRef.current.volume = volume;
            }
        }
    }, [volume])
    
    return (
        <div className={classes.root}>
            <div className={classes.mediaContent}>
                <div className={classes.overlay}>
                    <div className={classes.overlayHeader}>
                        <div>
                            <IconButton aria-label="delete" className={classes.iconButton} onClick={handleClose}>
                                <Close />
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
                        <IconButton aria-label="zoomIn" className={classes.iconButton} onClick={() => handleZoom(false)}>
                            <ZoomOutIcon font="small" />
                        </IconButton>
                        :
                        <IconButton aria-label="zoomOut" className={classes.iconButton} onClick={() => handleZoom(true)}>
                            <ZoomInIcon />
                        </IconButton>
                    }
                    { isLocal &&
                    <>
                        { audioState ?
                            <IconButton aria-label="micOn" className={classes.iconButton} onClick={() => changeMute('audio', false)}>
                                <Mic />
                            </IconButton>
                            :
                            <IconButton aria-label="micOff" className={classes.iconButton} onClick={() => changeMute('audio', true)}>
                                <MicOff />
                            </IconButton>
                        }
                        { videoState ?
                            <IconButton aria-label="cameraOn" className={classes.iconButton} onClick={() => changeMute('video', false)}>
                                <Videocam />
                            </IconButton>
                            :
                            <IconButton aria-label="cameraOff" className={classes.iconButton} onClick={() => changeMute('video', true)}>
                                <VideocamOff />
                            </IconButton>
                        }
                    </>
                    }
                        <VolumnControl value={volume} handleChange={(value) => changeVolume(value)} />
                    </div>
                </div>
                { loading &&
                    <div className={classes.loading}>
                    <HashLoader
                        css={override}
                        sizeUnit={"px"}
                        size={50}
                        color={'#c5c5c5'}
                        loading={true}
                    />
                    </div>
                }
                {/* { !loading && !videoState && 
                    <div className={classes.loading}>
                        <img src="/img/empty_video.jpg" alt="empty video" style={{height: 'inherit', width: 'inherit'}} />
                    </div>
                } */}
                <div className={classes.content}>
                    <video ref={userVideo} autoPlay style={{width: '100%'}} muted={muted}>
                    </video>
                    {/* <audio ref={userAudio} autoPlay /> */}
                    <SoundMeter size={echo} />
                </div>
                <div className={classes.username}>
                    {name}
                </div>
                { isLocal && viewerCounts &&
                    <div className={classes.counts}>
                        <span style={{padding: 3}}>{viewerCounts}</span>
                        <Visibility />
                    </div>
                }
                
            </div>
            
        </div>
    )
}

const UserVideoMemo = React.memo(UserVideo);

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

const VideoList = ({streams: remoteStreams, localStream, controlVideo, roomName, viewerCounts}) => {
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
        let streams = [];
        if(localStream || remoteStreams) {
            if(localStream) {
                dispatch({type: 'pending'})
                streams = [{...localStream, name: username, muted: true, viewerCounts: viewerCounts, isLocal: true }];
            } else {

            }

            if(Array.isArray(remoteStreams)) {
                dispatch({type: 'pending'})
                streams = [...streams, ...remoteStreams];
            }
            if(zoom) {
                let zoomStream = streams.find(({name}) => (name === zoom));
                if(zoomStream) {
                    let unZoomStreams = streams.filter(({name}) => (name !== zoom));
                    streams = [{...zoomStream, zoom: true}, ...unZoomStreams];
                }
            }
        }
        if(streams.length) {
            dispatch({type: 'resolved', data: streams});
        } else {
            dispatch({type: 'resolved', data: null});
        }
    }, [username, localStream, remoteStreams, zoom, viewerCounts])

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
                    if(zoom !== name)
                        setZoom(name);
                }
                break;
            case 'pause':
                if(name) {
                    controlVideo({...payload, roomName});
                }
                break;
            case 'resume':
                if(name) {
                    controlVideo({...payload, roomName});
                }
                break;
            case 'close':
                if(name) {
                    controlVideo({...payload, roomName});
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
            streams?.map(({ stream, name, audioState, videoState, locked, zoom, muted, viewerCounts, isLocal }, index) => (
                <UserVideoMemo
                    stream={stream} key={stream? stream.id: index} locked={locked} name={name}
                    controlVideo={handleVideo}
                    total={streams.length}
                    zoom={zoom}
                    muted={muted}
                    streamNum = {1+index}
                    viewerCounts={viewerCounts}
                    isLocal={isLocal}
                    audioState={audioState}
                    videoState={videoState}
                />
            ))
        }
        </div>
    )
}

export default React.memo(VideoList);