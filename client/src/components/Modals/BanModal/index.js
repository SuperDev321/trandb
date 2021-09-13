import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import { green } from '@material-ui/core/colors'
import CustomTextField from '../../CustomTextField';
import OutlinedButton from '../../OutlinedButton';
import useStyles from './styles';
import IpMaskInput from '../../IpMaskInput';
import { socket } from '../../../utils';
import Axios from 'axios';
import config from '../../../config';
import { useTranslation } from 'react-i18next';

const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

export default function BanModal({open, setOpen, initVal, roomName, isAdmin, banUser}) {
    const classes = useStyles();
    // const name = initVal.name?initVal.name: '';
    const name = initVal.name || '';
    const [type, setType] = useState('all');
    const [ip, setIp] = useState(initVal.ip?initVal.ip: '');
    const [kind, setKind] = useState('chat');
    const [reason, setReason] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if(initVal.name && open) {
            let token = window.localStorage.getItem('token');
            Axios.get(`${config.server_url}/api/users/`+initVal.name+'/ip', {
                headers: {
                    authorization: token
                }
            })
            .then((response) => {
                if(response.status === 200) {
                    setIp(response.data);
                }
            })
        }
    }, [open, initVal])

    const handleClose = () => {
        setOpen(false);
    };

    const handleIpChange = (e) => {
        if(e.target.value) {
            setIp(e.target.value);
        }
    }

    const handleBan = () => {
        let payload = {}
        if (isAdmin) {
            if(type === 'this' && roomName) {
                payload.room = roomName;
            }
            payload.ip = ip;
        } else {
            payload.room = roomName;
        }
        payload.reason = reason;
        payload.to = name;
        payload.kind = kind;
        banUser(payload);
        setOpen(false);
    }
    
    const handleChangeKind = (e) => {
        setKind(e.target.value);
    }

    return (
        <Dialog className={classes.dialog} fullWidth={true} maxWidth="xs"
            open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">{t('BanModal.ban_user')}</DialogTitle>
            <DialogContent className={classes.content}>
            
            <CustomTextField
                margin="dense"
                id="ban name"
                label="User name"
                type="text"
                fullWidth
                value={name}
                className={classes.textInput}
            />
            { isAdmin &&
            <>
            <CustomTextField
                autoComplete="off"
                name="banType"
                required
                fullWidth
                select
                id="banType"
                type="text"
                label={t('BanModal.ban_type')}
                InputLabelProps={{
                    shrink: true,
                }}
                className={classes.banType}
                value={type}
                onChange={(e)=>{setType(e.target.value)}}
            >
                <MenuItem value='all'>
                    {t('BanModal.all_rooms')}
                </MenuItem>
                <MenuItem value='this'>
                    {t('BanModal.this_room')}
                </MenuItem>
            </CustomTextField>
            <CustomTextField
                className={classes.ipField}
                label={t('BanModal.ip')}
                value={ip}
                fullWidth
                onChange={handleIpChange}
                name="ipInput"
                id="ip-input"
                InputProps={{
                    inputComponent: IpMaskInput,
                }}
            />
            </>
            }
            <FormControl component="fieldset">
                <RadioGroup row aria-label="ban-select" name="ban-select" className={classes.banSelect} value={kind} onChange={handleChangeKind}>
                    <FormControlLabel value="chat" control={<GreenRadio />} label={t('BanModal.chat')} />
                    <FormControlLabel value="camera" control={<GreenRadio />} label={t('BanModal.camera')} />
                </RadioGroup>
            </FormControl>
            <CustomTextField
                margin="dense"
                id="ban reason"
                label={t('BanModal.reason')}
                type="text"
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={classes.textInput}
            />
            </DialogContent>
            <DialogActions>
            <OutlinedButton onClick={handleClose} variant="outlined" color="primary">
                {t('BanModal.cancel')}
            </OutlinedButton>
            <OutlinedButton onClick={handleBan} variant="outlined" color="primary">
                {t('BanModal.ban')}
            </OutlinedButton>
            </DialogActions>
        </Dialog>
    );
}
