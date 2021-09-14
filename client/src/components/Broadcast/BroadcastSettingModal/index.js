import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import VideocamIcon from '@material-ui/icons/Videocam';
import { useTranslation } from 'react-i18next';
import VideoDeviceView from './VideoDeviceView';
import useDefaultMedia from './useDefaultMedia';
import DevicesSelector from './DevicesSelector';
import Loading from '../../Loading'
import { ChatContext } from '../../../context';
const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
    cameraBtn: {
        borderRadius: 20,
        height: 40,
        margin: 5,
        background: theme.palette.primary.main,
        width: drawerWidth-10
    },
    dialog: {
        '& .MuiPaper-root': {
            minWidth: 300,
            minHeight: 200
        }
    }
}));


function BroadcastSettingModal({roomName, startBroadcast, ...modalProps}) {
    
    const {error, status, data} = useDefaultMedia();
    
    const [lock, setLock] = useState(false);
    const [currentAudioDevice, setCurrentAudioDevice] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState('');
    
    const handleClickOK = () => {
        startBroadcast(roomName, lock, currentVideoDevice, currentAudioDevice);
        modalProps.onClose();
    }

    useEffect(() => {
        if((status === 'resolved') && data) {
            if(data) {
                const audioTrack = data?.getAudioTracks()[0];
                const videoTrack = data?.getVideoTracks()[0];
                if(audioTrack) {
                    const audioDevice = audioTrack.getSettings().deviceId;
                    setCurrentAudioDevice(audioDevice);
                }
                if(videoTrack) {
                    const videoDevice = videoTrack.getSettings().deviceId;
                    setCurrentVideoDevice(videoDevice);
                }
            }
        }
    }, [status, data])

    if (status === 'idle') {
        return <Loading />;
    } else if (status === 'pending') {
        return <Loading />;
    }
    // } else if (status === 'rejected') {
        // return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Can not find devices</div>;
    // } else if (status === 'resolved') {
    else {
        return (
            <>
                <DialogTitle id="form-dialog-title">Turn on devices to broadcast</DialogTitle>
                <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
                    <DevicesSelector
                        audio={currentAudioDevice}
                        video={currentVideoDevice}
                        setAudio = {(device) => setCurrentAudioDevice(device)} 
                        setVideo = {(device) => setCurrentVideoDevice(device)}
                    />
                    <FormControl>
                        <FormControlLabel
                            control={<Checkbox checked={lock} onChange={(e) => setLock(e.target.checked)} name="lockCheckbox" />}
                            label="Lock"
                        />
                    </FormControl>
                    <VideoDeviceView audioDevice={currentAudioDevice} videoDevice={currentVideoDevice} />
                </DialogContent>
                <DialogActions>
                <Button color="primary" onClick={modalProps.onClose}>
                    Cancel
                </Button>
                <Button color="primary" onClick={handleClickOK}>
                    OK
                </Button>
                </DialogActions>
            </>
        );
    }
}


const BroadcastSetting = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { startBroadcast, stopBroadcast, cameraState, name: roomName } = useContext(ChatContext);
    
    const handleClickOpen = () => {
        if(!cameraState) {
            setOpen(true);
        } else {
            stopBroadcast(roomName);
        }
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button fullWidth
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpen}
                    className={classes.cameraBtn}
                >{ cameraState ? t('SidebarLeft.stop_broadcasting'):
                    t('SidebarLeft.start_broadcasting')
                }
                    &nbsp;
            <VideocamIcon />
            </Button>
            { open
                ?
                <Dialog fullWidth
                    maxWidth='sm'
                    className={classes.dialog} aria-labelledby="form-dialog-title"  open={open} onClose={handleClose}>
                    <BroadcastSettingModal roomName={roomName} startBroadcast={startBroadcast} onClose={handleClose}/>
                </Dialog>
                :null
            }
        </div>
    )
}
export default BroadcastSetting;