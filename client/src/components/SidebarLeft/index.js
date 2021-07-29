import React, { useEffect, useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import t from 'prop-types'
import {
    InputBase,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import OnlineUser from '../OnlineUser';
import BroadcastSetting from '../Broadcast/BroadcastSettingModal';
import SeparateLine from '../SeparateLine';
import { useTranslation } from 'react-i18next';
import { SettingContext } from '../../context';
 
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
        scrollbarWidth: 'thin',
        scrollbarColor: `#585B5E #ecdbdb00`,
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(0 0 0 / 25%)',
            outline: 'none',
            borderRadius: '5px',
        }
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


const SideBarLeft = ({ roomName, username, mutes, blocks, globalBlocks, cameraBans, globalCameraBans,
    changeMuteState, sendPokeMessage, kickUser, banUser,
    users, viewers, viewBroadcast, stopBroadcastTo,
    addOrOpenPrivate, startBroadcast, stopBroadcast,
    cameraState }) => {
    const classes = useStyles();
    const [searchText, setSearchText] = useState('');
    const [sideUsers, setSideUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState(null);
    const [role, setRole] = useState(null);
    const {privateMutes, removePrivateMute, addPrivateMute, pointOption} = useContext(SettingContext)
    const {t} = useTranslation();

    const changePrivateMute = useCallback((user, isMuted) => {
        let {username, ip} = user
        if (isMuted) {
            removePrivateMute({username, ip})
        } else {
            addPrivateMute({username, ip})
        }
    }, [privateMutes, removePrivateMute, addPrivateMute])

    useEffect(() => {
        let me = users.find((item) => (item.username === username));
        if(me) setRole(me.role);
    }, [users, username])

    useEffect(() => {
        // const liveUserNames = broadcastingUsers?.map((user) => (user.name))
        const blockedNames = blocks?.map((item) => (item.username? item.username: null))
        const globalBlockedNames = globalBlocks?.map((item) => (item.username? item.username: null))
        const globalBlockedIps = globalBlocks?.map((item) => (item.ip? item.ip: null))
        const mutedNames = mutes?.map((item) => ((item&&item.username)? item.username: null))
        const mutedIps = mutes?.map((item) => ((item&&item.ip)? item.ip: null))
        const newUsers = users.map((user) => {
            let isBroadcasting = false
            let isBlocked = false
            let isMuted = false
            let isViewer = false
            let isPrivateMuted = false
            let isCameraBanned = false
            
            if (globalBlockedNames && globalBlockedNames.includes(user.username)) isBlocked = true
            if (globalBlockedIps && globalBlockedIps.includes(user.ip)) isBlocked = true
            if (!isBlocked && blockedNames && blockedNames.includes(user.username)) isBlocked = true
            if(mutedNames && mutedNames.includes(user.username)) isMuted = true
            if(!isMuted && mutedIps && mutedIps.includes(user.ip)) isMuted = true
            if (user.username === username && cameraState) {
                isBroadcasting = cameraState
                isViewer = true
            } else {
                if (user.video && user.video.room === roomName) {
                    const { locked } = user.video;
                    if (locked) {
                        isBroadcasting = 'locked';
                    } else {
                        isBroadcasting = true;
                    }
                }
                if (viewers && viewers.includes(user.username)) {
                    isViewer = true
                }
            }
            
            if (privateMutes?.find((item) => (item.username === user.username || item.ip === user.ip))) {
                isPrivateMuted = true
            }
            if (globalCameraBans) {
                for (const { username, ip, fromIp, toIp } of globalCameraBans) {
                    if (username === user.username || user.ip === ip) {
                        isCameraBanned = true;
                        break;
                    }
                    if (user.ip > fromIp && user.ip < toIp) {
                        isCameraBanned = true;
                        break;
                    }
                }
            }
            if (!isCameraBanned && cameraBans) {
                for (const { username, ip, fromIp, toIp } of cameraBans) {
                    if (username === user.username || user.ip === ip) {
                        isCameraBanned = true;
                        break;
                    }
                    if (user.ip > fromIp && user.ip < toIp) {
                        isCameraBanned = true;
                        break;
                    }
                }
            }
            

            return {
                isBroadcasting,
                isBlocked,
                isMuted,
                isViewer,
                isPrivateMuted,
                isCameraBanned,
                ...user
            }
        })
        newUsers.sort((user1, user2) => {
            if (!user1.isBroadcasting && user2.isBroadcasting) {
                return 1
            } else if (user1.isBroadcasting && !user2.isBroadcasting) {
                return -1
            }
            else {
                if (pointOption) {
                    if (user1.point < user2.point) {
                        return 1;
                    } else if (user1.point > user2.point) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
                
            }
        })
        setSideUsers(newUsers)
    }, [users, blocks, globalBlocks, mutes, cameraBans, globalCameraBans, privateMutes, viewers, username, cameraState, pointOption])


    useEffect(() => {
        if(searchText) {
            const filteredUsers = sideUsers.filter((item) => (item.username.includes(searchText)));
            setFilteredUsers(filteredUsers);
        } else {
            setFilteredUsers(sideUsers)
        }
    }, [searchText, sideUsers])

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
                { filteredUsers &&
                    filteredUsers.map((user, index)=>(
                            <OnlineUser
                                roomName={roomName}
                                username={username}
                                role={role}
                                user={user} key={user? user._id: index}
                                isMuted={user.isMuted}
                                isPrivateMuted={user.isPrivateMuted}
                                isBlocked = {user.isBlocked}
                                isBroadcasting={user.isBroadcasting}
                                isViewer={user.isViewer}
                                viewBroadcast={viewBroadcast}
                                stopBroadcastTo={stopBroadcastTo}
                                addOrOpenPrivate={addOrOpenPrivate}
                                changeMuteState={changeMuteState}
                                sendPokeMessage={sendPokeMessage}
                                kickUser={kickUser}
                                banUser={banUser}
                                changePrivateMute={changePrivateMute}
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

SideBarLeft.propTypes = {
    blocks: t.array,
    globalBlocks: t.array
}

export default SideBarLeft;