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
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    cameraBtn: {
        borderRadius: 20,
        height: 40,
        margin: 5,
        background: theme.palette.primary.main,
        width: drawerWidth-10
    },
}));


function BroadcastSettingModal({roomName, startBroadcast, users, ...modalProps}) {
    
    
    const {data: devices, error: deviceError, status: deviceStatus} = useDevices();
    const [lock, setLock] = useState(false);
    const [audioDevices, setAudioDevices] = useState([]);
    const [videoDevices, setVideoDevices] = useState([]);
    const [currentAudioDevice, setCurrentAudioDevice] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState('');
    const [usersState, setUsersState] = useState(null);
    const { t } = useTranslation();
    
    const handleUserStateChange = (event) => {
        if(usersState) {
            let states = [...usersState];
            let userState = states.find((state) => (state.username === event.target.name));
            userState.checked = event.target.checked;
            setUsersState(states);
        }
    };
    
    useEffect(() => {
        // console.log('users',users);
        if(users) {
            let states = users.map((user) => ({...user, checked: true}));
            setUsersState(states);
        }
    }, [users])

    const handleClickOK = () => {
        startBroadcast(roomName, lock, currentVideoDevice, currentAudioDevice);
        modalProps.onClose();
    }

    const devicesDOM = () => {
        if (deviceStatus === 'idle') {
            return null;
        } else if (deviceStatus === 'pending') {
            return null;
        } else if (deviceStatus === 'rejected') {
            return deviceError;
        } else if (deviceStatus === 'resolved') {
            let { audioDevices, videoDevices } = devices;
            return (
                <>
                    <FormControl>
                        <InputLabel id="audio-select-helper-label">Audio</InputLabel>
                        <Select
                            labelId="audio-select-helper-label"
                            id="audio-select-helper"
                            value={currentAudioDevice}
                            onChange={(e) => {console.log('change event');setCurrentAudioDevice(e.target.value)}}
                        >
                            { audioDevices?.map((item, index) => (
                                <MenuItem value={item.deviceId} key={index}>{item.label}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="video-select-helper-label">Video</InputLabel>
                        <Select
                            labelId="video-select-helper-label"
                            id="video-select-helper"
                            value={currentVideoDevice}
                            onChange={(e) => setCurrentVideoDevice(e.target.value)}
                        >
                            { videoDevices?.map((item, index) => (
                                <MenuItem value={item.deviceId} key={index}>{item.label}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </>
            )
        } else {
            throw new Error('This should be impossible');
        }
    }
    
    

    return (
        <Dialog {...modalProps} >
            <DialogTitle id="form-dialog-title">Turn on devices to broadcast</DialogTitle>
            <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
            {/* <DialogContentText>
                Select users to broadcast
            </DialogContentText> */}
            {/* <FormControl>
                <FormLabel component="legend">Select users to broadcast</FormLabel>
                <FormGroup>
                { usersState && usersState.map((item, index) => (
                    <FormControlLabel key={index}
                        control={<Checkbox checked={item.checked} onChange={handleUserStateChange} name={item.username} />}
                        label={item.username}
                    />
                ))
                    
                }
                </FormGroup>
            
            </FormControl> */}
            <FormControl>
                <FormLabel component="legend">Select devices to broadcast</FormLabel>
                <FormGroup>
                    { 
                        devicesDOM()
                    }
                </FormGroup>
            </FormControl>
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
        </Dialog>
    );
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
                ?<BroadcastSettingModal roomName={roomName} users={users} open={open} onClose={handleClose} aria-labelledby="form-dialog-title" startBroadcast={startBroadcast}/>
                :null
            }
        </div>
    )
}
export default BroadcastSetting;