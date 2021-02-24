import React, { useEffect, useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    InputBase,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import OnlineUser from '../OnlineUser';
import BroadcastSetting from '../Broadcast/BroadcastSettingModal';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.menu.background,
        fontSize: '0.85rem'
    },
    cameraBtn: {
        borderRadius: '0px',
        height: '40px',
        background: theme.palette.primary.main,
    },
    roomInfo: {
        color: theme.palette.primary.main,
        height: 40,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
    },
    roomName: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingRight: 10,
        color: theme.palette.menu.color
    },
    usersCount: {
        fontSize: 20,
        lineHeight: 1,
        color: theme.palette.menu.color
    },
    list: {
        padding: '0',
        flexGrow: 1,
        overflow: 'auto',
        
    },
    listItem: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
    },
    searchRoot: {
        width: '100%',
        padding: '5px 10px',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        width: '100%',
        boxShadow: '0 0 0px 1px #0000002b',
        color: theme.palette.menu.color
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#80808073',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
        // [theme.breakpoints.up('md')]: {
        //     width: '20ch',
        // },
    },
}))


const SideBarLeft = ({ roomName, username, mutes, unReadInfo, changeMuteState, sendPokeMessage, kickUser, banUser,
    users,
    addOrOpenPrivate,
     cameraState, openCamera, closeCamera }) => {
    const classes = useStyles();
    const [searchText, setSearchText] = useState('');
    const [sideUsers, setSideUsers] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {
        let me = users.find((item) => (item.username === username));
        if(me) setRole(me.role);
    }, [users, username])

    useEffect(() => {
        
        if(searchText) {
            let filteredUsers = users.filter((item) => (item.username.includes(searchText)));
            setSideUsers(filteredUsers);
        } else {
            setSideUsers(users);
        }
    }, [searchText, users])

    const isMuted = (user) => {
        if(mutes.includes(user.username)) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className={classes.root}>
            <BroadcastSetting users={users} className={classes.cameraBtn}/>
            <Divider />
            <div className={classes.roomInfo}>
                <span className={classes.roomName}>{roomName}</span>
                <span className={classes.usersCount}>{users&& `(${users.length})`}</span>
            </div>
            <Divider />
            <div  className={classes.list}>
                { sideUsers &&
                        sideUsers.map((user, index)=>(
                            <OnlineUser
                                roomName={roomName}
                                username={username}
                                role={role}
                                user={user} key={index}
                                isMuted={isMuted(user)}
                                addOrOpenPrivate={addOrOpenPrivate}
                                changeMuteState={changeMuteState}
                                sendPokeMessage={sendPokeMessage}
                                kickUser={kickUser}
                                banUser={banUser}
                            />
                        ))
                }
                
            </div>
            
            <div className={classes.searchRoot}>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchText}
                    onChange={(e) => {setSearchText(e.target.value)}}
                />
            </div>
            </div>
        </div>
    )
}

export default SideBarLeft;