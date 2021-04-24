import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {mediaType} from '../../../utils'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Checkbox,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import VideocamIcon from '@material-ui/icons/Videocam';
import { useTranslation } from 'react-i18next';
import useDevices from './useDevices';
import VideoDeviceView from './VideoDeviceView';
import useDefaultMedia from './useDefaultMedia';
import DevicesSelector from './DevicesSelector';
import Loading from './Loading'
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


function BroadcastSettingModal({roomName, startBroadcast, users, ...modalProps}) {
    
    const {error, status, data} = useDefaultMedia();
    
    const [lock, setLock] = useState(false);
    const [currentAudioDevice, setCurrentAudioDevice] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState('');
    const [usersState, setUsersState] = useState(null);
    const { t } = useTranslation();
    
    const handleClickOK = () => {
        startBroadcast(roomName, lock, currentVideoDevice, currentAudioDevice);
        modalProps.onClose();
    }

    useEffect(() => {
        if((status === 'resolved') && data) {
            const stream = data;
            if(stream) {
                const audioTrack = stream.getAudioTracks()[0];
                const videoTrack = stream.getVideoTracks()[0];
                const audioDevice = audioTrack.getSettings().deviceId;
                const videoDevice = videoTrack.getSettings().deviceId;
                setCurrentAudioDevice(audioDevice);
                setCurrentVideoDevice(videoDevice);
            }
        }
    }, [status, data])

    if (status === 'idle') {
        return <Loading />;
    } else if (status === 'pending') {
        return <Loading />;
    } else if (status === 'rejected') {
        return error;
    } else if (status === 'resolved') {
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


const BroadcastSetting = ({users, startBroadcast, stopBroadcast, cameraState, roomName}) => {
    const classes = useStyles();
    
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        // console.log('users', users)
        if(!cameraState) {
            setOpen(true);
        } else {
            stopBroadcast(roomName);
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { t } = useTranslation();
    // const handleOK = () => {
    //     if(usersState) {
    //         let usersChecked = usersState.filter((state) => (state.checked));
    //         // console.log(usersChecked);
    //     }
    //     setOpen(false);
    // }
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
                    <BroadcastSettingModal roomName={roomName} users={users} startBroadcast={startBroadcast} onClose={handleClose}/>
                </Dialog>
                :null
            }
        </div>
    )
}
export default BroadcastSetting;