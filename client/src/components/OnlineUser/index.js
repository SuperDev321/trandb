import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Badge,
} from '@material-ui/core';
import { deepOrange, pink, blue, green, yellow, grey } from '@material-ui/core/colors';
import {
    Videocam,
    VideocamOff,
    Block,
    Check,
    StarRounded,
    Visibility,
    Lock,
    PhoneIphone
} from '@material-ui/icons';
import RoomUserName from '../RoomUserName';
import config from '../../config';
import { SettingContext } from '../../context';
const useStyles = makeStyles((theme) => ({
    listItem: {
        display: 'flex',
        // flexWrap: 'wrap'
        // paddingTop: theme.spacing(0),
        // paddingBottom: theme.spacing(0),
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '2px 15px 2px 15px',
        width: '100%',
        '&:hover': {
            background: '#2f788814'
        },
        color: props => {
            if (props.gender && props.avatarColor) {
                if (props.gender === 'male') return '#1e31ba';
                else if (props.gender === 'female') return '#9e59ca'
            }
            return 'inherit'
        }
    },
    username: {
        // font: 'bold 14px sans-serif',
        // cursor: 'pointer',
        flexGrow: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
    },
    role: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        fontSize: 15,
        marginRight: theme.spacing(0.5),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: (props) => {
            if(props.role === 'guest') {
                return deepOrange[500];
            } else {
                return blue[500];
            }
        }
    },
    avatar: {
        width: theme.spacing(3.8),
        height: theme.spacing(3.8),
        minWidth: 0
    },
    avatarBadge: {
        '& .MuiBadge-badge': {
            width: theme.spacing(3.8),
            height: theme.spacing(3.8), 
        },
        '& .MuiSvgIcon-root': {
            fontSize: '2rem'
        }
    },
    icon: {
        color: '#e6e6e6',
        marginRight: 1,
        cursor: 'pointer'
    },
    cardRoot: {
        width: 200,
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 100,
        width: 200,
        backgroundImage: '/img/public_chat.png',
    },
    cardButton: {
        borderRadius: '0',
        height: 40,
        textTransform: 'none',
    },
    mute: {
        color: pink[500],
        textTransform: 'none',
    },
    kick: {
        color: pink[500],
        textTransform: 'none',
    },
    adminStar: {
        color: pink[500]
    },
    ownerStar: {
        color: blue[600]
    },
    moderatorStar: {
        color: blue[300]
    },

}))

const StyledBadge = withStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing(0.5),
    },
    badge: {
        padding: 0,
        color: pink[500],
        transform: 'none'
    }
}))((props) => (
    <Badge
        {...props}
    />
))

const OnlineUser = ({roomName, username, user, role, isMuted, isPrivateMuted, isBlocked, isBroadcasting, isViewer,
        changeMuteState, sendPokeMessage, kickUser, banUser, viewBroadcast, stopBroadcastTo,
        // , setOpenPrivate, setPrivateTo
        addOrOpenPrivate, changePrivateMute
    }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { avatarOption, avatarColor } = useContext(SettingContext);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const classes = useStyles({role: user.role, gender: user.gender, avatarColor});

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDoubleClickEye = () => {
        stopBroadcastTo(roomName, user._id, user.username);
    }

    const handleDoubleClickVideo = () => {
        const { video } = user;
        if (video) {
            const { locked, producers } = video;
            viewBroadcast(roomName, user._id, user.username, producers, locked);
        }
    }

    useEffect(() => {
        const setRealAvatar = () => {    
            if (typeof user === 'object' && user !== null) {
                const {avatarObj, currentAvatar, gender} = user
                if (!avatarOption) {
                    // self avatar
                    if (avatarObj && avatarObj[currentAvatar]) {
                        if (currentAvatar === 'default') {
                            return setAvatarUrl(config.image_path + 'avatar/' + avatarObj[currentAvatar])
                        } else if (currentAvatar === 'joomula') {
                            return setAvatarUrl(config.main_site_url+avatarObj[currentAvatar])
                        }
                    } else {
                        
                    }
                } else {
                    // joomula avatar
                    if (avatarObj.joomula) {
                        return setAvatarUrl(config.main_site_url+avatarObj.joomula)
                    }
                }
                if (avatarColor) {
                    if (gender === 'male') {
                        return setAvatarUrl(config.image_path + 'male.png')
                    } else if (gender === 'female') {
                        return setAvatarUrl(config.image_path + 'female.png')
                    }
                }
                setAvatarUrl(config.image_path + 'default_avatar.png')
            }
        }
        setRealAvatar()
    }, [user, avatarOption, avatarColor])

    const open = Boolean(anchorEl);
    return (
        <div>
            <div className={classes.listItem}
            >
                <Avatar className={classes.role}>{
                    user.role === 'guest' ? 'G':
                    <Check fontSize="small" />
                }</Avatar>
                <StyledBadge
                    className={classes.avatarBadge}
                    badgeContent={(isMuted || isBlocked) && <Block  />}
                >
                    <Avatar alt="User avatar" src={avatarUrl}
                        className={classes.avatar}
                    />
                </StyledBadge>
                {
                    isViewer
                    ?
                    <Visibility className={classes.icon} style={{ color: green[300] }} onDoubleClick={handleDoubleClickEye}/>:null                }
                { isBroadcasting ?
                    <Videocam className={classes.icon}  onDoubleClick={handleDoubleClickVideo}
                    // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: green[300] }}
                    />
                    :null
                }

                { user.isCameraBanned ?
                    <VideocamOff className={classes.icon}  onDoubleClick={handleDoubleClickVideo}
                    // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: grey[800] }}
                    />
                    :null
                }
                
                { isBroadcasting === 'locked'?
                    <Lock className={classes.icon}
                        // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: yellow[700], fontSize: 17 }}
                    />
                    :null
                }
                { user.isMobile &&
                    <PhoneIphone className={classes.icon}
                        // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: blue[700], fontSize: 17 }}
                    />
                }
                <div className={classes.username}>
                    <RoomUserName
                        user={user}
                        roomName={roomName}
                        isMine={username === user.username}
                        displayYou={true}
                        changeMuteState={changeMuteState}
                        sendPokeMessage={sendPokeMessage}
                        viewBroadcast={viewBroadcast}
                        kickUser={kickUser}
                        banUser={banUser}
                        addOrOpenPrivate={addOrOpenPrivate}
                        role={role}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        open={open}
                        handleClose={handleClose}
                        isMuted={isMuted}
                        isPrivateMuted={isPrivateMuted}
                        isBlocked={isBlocked}
                        stopBroadcastTo={stopBroadcastTo}
                        changePrivateMute={changePrivateMute}
                        showAboutMe={true}
                        showPoint={true}
                    />
                {( user.role === 'admin' || user.role === 'super_admin') &&
                    <StarRounded className={classes.adminStar} />
                }
                { user.role === 'owner' &&
                    <StarRounded className={classes.ownerStar} />
                }
                { user.role === 'moderator' &&
                    <StarRounded className={classes.moderatorStar} />
                }
                </div>
            </div>
        </div>
    );
}

export default OnlineUser;