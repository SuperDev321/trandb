import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    List,
    ListSubheader,
    Divider
} from '@material-ui/core';
import OnlineUser from '../OnlineUser';
import BroadcastSetting from '../Broadcast/BroadcastSettingModal';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
    },
    cameraBtn: {
        borderRadius: '0px',
        height: '40px',
        background: theme.palette.primary.main,
    },
    list: {
        padding: '0',
        flexGrow: 1,
        
    },
    listItem: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5)
    }
}))


const SideBarLeft = ({ username, unReadInfo, users, setOpenPrivate, setPrivateTo, cameraState, openCamera, closeCamera }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <BroadcastSetting users={users} className={classes.cameraBtn}/>
            <Divider />
            <List  subheader={<ListSubheader>online</ListSubheader>}
            component="nav" aria-label="main mailbox folders" className={classes.list}>
                { users &&
                        users.map((user, index)=>(
                            <OnlineUser username={username} user={user} key={index} setOpenPrivate={setOpenPrivate}
                                setPrivateTo={setPrivateTo} unRead={unReadInfo[user.username]}/>
                        ))
                }
                
            </List>
        </div>
    )
}

export default SideBarLeft;