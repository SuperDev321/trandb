import React, { useEffect, useState, useCallback } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    InputBase,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import OnlineUser from '../OnlineUser';
import BroadcastSetting from '../Broadcast/BroadcastSettingModal';
import SeparateLine from '../SeparateLine';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.menu.background,
        fontSize: '0.85rem',
        color: theme.palette.textColor.main
    },
    cameraBtn: {
        borderRadius: '0px',
        height: '40px',
        background: theme.palette.primary.main,
    },
    roomInfo: {
        // color: theme.palette.primary.main,
        minHeight: 40,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
    },
    roomName: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingRight: 10,
        textAlign: 'center',
        overflow: 'hidden'
        // color: theme.palette.menu.color
    },
    usersCount: {
        fontSize: 20,
        lineHeight: 1,
        // color: theme.palette.menu.color
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
        backgroundColor: theme.palette.inputField,
        width: '100%',
        boxShadow: '0 0 0px 1px #0000002b',
        color: theme.palette.menu.color,
        backgroundColor: theme.palette.inputField
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


const SideBarLeft = ({ roomName, username, mutes, blocks, globalBlocks, changeMuteState, sendPokeMessage, kickUser, banUser,
    users, broadcastingUsers, viewers, viewBroadcast, stopBroadcastTo,
    addOrOpenPrivate, startBroadcast, stopBroadcast,
    cameraState, openCamera, closeCamera }) => {
    const classes = useStyles();
    const [searchText, setSearchText] = useState('');
    const [sideUsers, setSideUsers] = useState([]);
    const [role, setRole] = useState(null);
    const {t} = useTranslation();

    useEffect(() => {
        let me = users.find((item) => (item.username === username));
        if(me) setRole(me.role);
    }, [users, username])


    useEffect(() => {
        let filteredUsers = users;
        if(searchText) {
            filteredUsers = filteredUsers.filter((item) => (item.username.includes(searchText)));
        } else {
            
        }
        setSideUsers(filteredUsers);
    }, [searchText, users])

    const isMuted = (user) => {
        let mutedNames = Array.isArray(mutes)? mutes.map((item) => ((item&&item.username)? item.username: null)): [];
        let mutedIps =  Array.isArray(mutes)? mutes.map((item) => ((item&&item.ip)? item.ip: null)): [];
        if( mutedNames.includes(user.username) || mutedIps.includes(user.ip)) {
            return true;
        } else {
            return false;
        }
    }

    const isBlocked = (user) => {
        let blockedNames = blocks.map((item) => (item.username? item.username: null));
        let globalBlockedNames = globalBlocks.map((item) => (item.username? item.username: null));
        blockedNames = [...blockedNames, ...globalBlockedNames];
        let blockedIps = blocks.map((item) => (item.ip? item.username: null));
        let globalBlockedIps = globalBlocks.map((item) => (item.ip? item.ip: null));
        blockedIps = [...blockedIps, ...globalBlockedIps];
        if((user.username && (blockedNames.includes(user.username)))
            || (user.ip && (blockedIps.includes(user.ip)))
        ) {
            return true;
        } else {
            return false;
        }
    }

    const isBroadcasting = useCallback((user) => {
        if(user.username === username) {
            return cameraState;
        } else {
            if(Array.isArray(broadcastingUsers)) {
                let result = broadcastingUsers.find(({name}) => (name === user.username));
                if(result) {
                    if(result.locked) {
                        return 'locked';
                    } else {
                        return true;
                    }
                    
                } else {
                    return false;
                }
            }
            return false;
        }
        
    }, [broadcastingUsers, cameraState]);

    const isViewer = useCallback((user) => {
        if(user.username === username) {
            return cameraState;
        } else {
            if(Array.isArray(viewers) && viewers.includes(user.username)) {
                return true
            }
            return false;
        }
        
    }, [viewers, cameraState]);

    return (
        <div className={classes.root}>
            <BroadcastSetting cameraState={cameraState} users={users} roomName={roomName} className={classes.cameraBtn}
                startBroadcast={startBroadcast} 
                stopBroadcast={stopBroadcast}
            />
            <SeparateLine />
            <div className={classes.roomInfo}>
                <span className={classes.roomName}>{roomName}</span>
                <span className={classes.usersCount}>{users&& `(${users.length})`}</span>
            </div>
            <SeparateLine />
            <div  className={classes.list}>
                { sideUsers &&
                        sideUsers.map((user, index)=>(
                            <OnlineUser
                                roomName={roomName}
                                username={username}
                                role={role}
                                user={user} key={index}
                                isMuted={isMuted(user)}
                                isBlocked = {isBlocked(user)}
                                isBroadcasting={isBroadcasting(user)}
                                isViewer={isViewer(user)}
                                viewBroadcast={viewBroadcast}
                                stopBroadcastTo={stopBroadcastTo}
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
                    placeholder={t('SidebarLeft.search')}
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