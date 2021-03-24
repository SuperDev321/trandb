import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
    FormHelperText,
    Checkbox,
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


function BroadcastSettingModal({users, ...modalProps}) {
    
    
    const {data: devices, error: deviceError, status: deviceStatus} = useDevices();
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
    // useEffect(() => {
    //     if(open)
    //         getDevices()
    //         .then((devices) => {
    //             let audioDevices = [];
    //             let videoDevices = [];
    //             if(devices && devices.length) {
    //                 for (let index = 0; index < devices.length; index++) {
    //                     const element = devices[index];
    //                     if (element.deviceId != "default" && element.deviceId != "communications") {
    //                         if (element.kind == "audioinput") {
    //                             audioDevices.push({deviceId: element.deviceId, label: element.label, groupId: element.groupId});
    //                         } else if (element.kind == "videoinput") {
    //                             videoDevices.push({deviceId: element.deviceId, label: element.label, groupId: element.groupId});
    //                         }
    //                     }
    //                 }
    //             }
    //             console.log(audioDevices);
    //             console.log(videoDevices);
    //         });
    // }, [open])

    useEffect(() => {
        // console.log('users',users);
        if(users) {
            let states = users.map((user) => ({...user, checked: true}));
            setUsersState(states);
        }
    }, [users])

    const devicesDOM = () => {
        if (deviceStatus === 'idle') {
            return null;
        } else if (deviceStatus === 'pending') {
            return null;
        } else if (deviceStatus === 'rejected') {
            return deviceError;
        } else if (deviceStatus === 'resolved') {
            return (
                <>
                { devices?.map((item, index) => (
                    <FormControlLabel key={index}
                        control={<Checkbox name={item.groupId} />}
                        label={item.label}
                    />
                ))
                }
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
            <FormControl>
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
            
            </FormControl>
            <FormControl>
                <FormLabel component="legend">Select devices to broadcast</FormLabel>
                <FormGroup>
                    { 
                        devicesDOM()
                    }
                </FormGroup>
            </FormControl>
            <VideoDeviceView />
            </DialogContent>
            <DialogActions>
            <Button color="primary">
                Cancel
            </Button>
            <Button color="primary">
                OK
            </Button>
            </DialogActions>
        </Dialog>
    );
}


const BroadcastSetting = ({users}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        // console.log('users', users)
        setOpen(true);
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
                        >{t('SidebarLeft.start_broadcasting')}
                            &nbsp;
                    <VideocamIcon />
            </Button>
            { open
                ?<BroadcastSettingModal users={users} open={open} open={open} onClose={handleClose} aria-labelledby="form-dialog-title"/>
                :null
            }
        </div>
    )
}
export default BroadcastSetting;