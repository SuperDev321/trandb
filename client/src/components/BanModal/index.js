import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Grid,
    Switch,
    Input
} from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import CustomTextField from '../CustomTextField';
import OutlinedButton from '../OutlinedButton';
import useStyles from './styles';
import IpMaskInput from '../IpMaskInput';
import { getSocket } from '../../utils';


export default function BanModal({open, setOpen, initVal, roomName}) {
    const classes = useStyles();
    const name = initVal.name?initVal.name: '';
    const [type, setType] = useState('all');
    const [ip, setIp] = useState(initVal.ip?initVal.ip: '');
    // const [toIp, setToIp] = useState(initVal.ip?initVal.ip: '');
    // const [fromIp, setFromIp] = useState(initVal.ip?initVal.ip: ''); 
    // const [ipSel, setIpSel] = useState(true);
    const socket = getSocket();
    const handleClose = () => {
        setOpen(false);
    };

    const handleIpChange = (e) => {
        if(e.target.value) {
            setIp(e.target.value); console.log(ip)
        }
    }
    // const handleFromIpChange = (e) => {
    //     if(e.target.value) {
    //         setFromIp(e.target.value); console.log(ip)
    //     }
    // }
    // const handleToIpChange = (e) => {
    //     if(e.target.value) {
    //         setToIp(e.target.value); console.log(ip)
    //     }
    // }

    const handleBan = () => {
        
        let payload = {}
        if(type === 'this' && roomName) {
            payload.room = roomName;
        }
        // if(ipSel) {
        payload.ip = ip;
        // } else if(fromIp && toIp){
        //     payload.fromIp = fromIp;
        //     payload.toIp = toIp
        // }
        payload.to = name;
        console.log(payload)
        socket.emit('ban user', payload);
        setOpen(false);
    }
    

    return (
        <Dialog className={classes.dialog} fullWidth={true} maxWidth="xs"
            open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Ban User</DialogTitle>
            <DialogContent className={classes.content}>
            
            <CustomTextField
                margin="dense"
                id="ban name"
                label="User name"
                type="text"
                fullWidth
                value={name}
                // onChange={(e) => {setName(e.target.value)}}
                className={classes.username}
            />
            <CustomTextField
                autoComplete="off"
                name="banType"
                required
                fullWidth
                select
                id="banType"
                type="text"
                label="Ban Type"
                InputLabelProps={{
                    shrink: true,
                }}
                className={classes.banType}
                value={type}
                onChange={(e)=>{setType(e.target.value)}}
            >
                <MenuItem value='all'>
                    All Rooms
                </MenuItem>
                <MenuItem value='this'>
                    This Room
                </MenuItem>
            </CustomTextField>
            {/* <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Range</Grid>
                <Grid item>
                    <Switch
                        checked={ipSel}
                        onChange={(e) => {setIpSel(e.target.checked)}}
                        name="ipSel"
                        color="default"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                </Grid>
                <Grid item>IP</Grid>
            </Grid> */}
            <Grid component="label" container alignItems="center" spacing={1}>
                {/* { ipSel && */}
                    <Grid  item xs={12} sm={12} >
                        <CustomTextField className={classes.ipField}
                            label='IP'
                            value={ip}
                            fullWidth
                            onChange={handleIpChange}
                            name="ipInput"
                            id="ip-input"
                            InputProps={{
                                inputComponent: IpMaskInput,
                            }}
                    />
                    </Grid>
                {/* } */}
                
                {/* { !ipSel &&
                <> */}
                {/* <Grid  item xs={12} sm={6} >
                <CustomTextField className={classes.ipField}
                    label="From"
                    value={fromIp}
                    fullWidth
                    onChange={handleFromIpChange}
                    name="fromIpInput"
                    id="from-ip-input"
                    InputProps={{
                        inputComponent: IpMaskInput,
                    }}
                />
                </Grid> */}
                {/* <Grid  item xs={12} sm={6} >
                <CustomTextField  className={classes.ipField}
                    label="To"
                    value={toIp}
                    onChange={handleToIpChange}
                    name="toIpInput"
                    id="to-ip-input"
                    InputProps={{
                        inputComponent: IpMaskInput,
                    }}
                />
                </Grid>
                </>
                } */}
            </Grid>
            
            </DialogContent>
            <DialogActions>
            <OutlinedButton onClick={handleClose} variant="outlined" color="primary">
                Cancel
            </OutlinedButton>
            <OutlinedButton onClick={handleBan} variant="outlined" color="primary">
                Ban
            </OutlinedButton>
            </DialogActions>
        </Dialog>
    );
}
