import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    List
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PasswordModal from '../PasswordModal'
import { getRooms } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      minWidth: 400,
      padding: '0 10px',
      backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: '0 10px',
        // borderRadius: '0',
        height: '30px',
        color: theme.palette.primary.tab,
        borderColor: theme.palette.primary.tab,
    },
}));

export default function AddRoomModal({addRoom}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState(null);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [roomNameForPassword, setRoomNameForPassword] = useState('');
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickRoom = (room) => {
        addRoom(room, (result, message) => {
            if(result) {
                setOpen(false);
            } else {
                setOpen(false);
                if(message === 'already_entered') {
                    enqueueSnackbar(t('AddRoomModal.error1'), {variant: 'error'});
                } else if(message === 'password'){
                    setRoomNameForPassword(room);
                    setOpenPasswordModal(true);
                }
            }
        }); 
    }

    useEffect(() => {
        if(open) {
            getRooms((data) => {
                if(Array.isArray(data)) {
                    let sortedRooms = data.sort((roomA, roomB) => {
                        return roomB.users - roomA.users;
                    });
                    setRooms(sortedRooms);
                }
                // console.log(data);
            },
            (err) => {
                alert(err);
            })
        }
    }, [open])

    return (
        <>
        <Button
            variant="outlined"
            color="primary" size="small"
            onClick={handleClickOpen}
            className={classes.button}
        >
            <AddIcon />
        </Button>
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{t('AddRoomModal.add_room')}</DialogTitle>
            <DialogContent>
            <List dense className={classes.root}>
            {rooms && rooms.map((room, index) => {
                const labelId = `room-list-label-${index}`;
                return (
                <ListItem key={index} button onClick={() => handleClickRoom(rooms[index].name)}>
                    <ListItemAvatar>
                    <Avatar
                        alt='room avatar'
                        src={room.icon? `/img/rooms/${room.icon}`: `/img/public_chat.png`}
                    />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={`(${room.users}) ${room.name}`} />
                </ListItem>
                );
            })}
            </List>
            </DialogContent>
            {/* <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
                Add
            </Button>
            </DialogActions> */}
        </Dialog>
        <PasswordModal
            open={openPasswordModal}
            setOpen={setOpenPasswordModal}
            room={roomNameForPassword}
            // onClose={() => {if(!roomIndex) setRoomIndex(0)}}
        />
        </>
    );
}