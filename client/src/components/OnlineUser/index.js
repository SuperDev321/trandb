import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Badge,
} from '@material-ui/core';
import { deepOrange, pink, blue, green, yellow } from '@material-ui/core/colors';
import {
    Videocam,
    Block,
    Check,
    StarRounded,
    Visibility,
    Lock
} from '@material-ui/icons';
import RoomUserName from '../RoomUserName';
import config from '../../config';
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
            background: '#00000014'
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
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        
        minWidth: 0
    },
    avatarBadge: {
        '& .MuiBadge-badge': {
            width: theme.spacing(3.5),
            height: theme.spacing(3.5), 
        },
        '& .MuiSvgIcon-root': {
            fontSize: '2rem'
        }
    },
    camera: {
        color: '#e6e6e6',
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
    }
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

const OnlineUser = ({roomName, username, user, role, isMuted, isBlocked, isBroadcasting, isViewer,
        changeMuteState, sendPokeMessage, kickUser, banUser, viewBroadcast, stopBroadcastTo,
        // , setOpenPrivate, setPrivateTo
        addOrOpenPrivate,
    }) => {
    const classes = useStyles({role: user.role});
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [openBan, setOpenBan] = React.useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDoubleClickEye = () => {
        stopBroadcastTo(roomName, user._id, user.username);
    }

    const handleDoubleClickVideo = () => {
        viewBroadcast(roomName, user._id, user.username);
    }

    // const handleClickProfile = () => {
    //     if(user && user.username)
    //         window.open('/profile/'+user.username);
    //     setAnchorEl(null);
    // }

    // const sendPoke = () => {
    //     setAnchorEl(null);
    //     setTimeout(() => {
    //         sendPokeMessage(roomName, user.username);
    //     }, 0)
        
    // }

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
                    <Avatar alt="User avatar" src={
                            user.avatar
                            ?config.main_site_url+user.avatar 
                            :user.gender === 'male' ? '/img/male.png': '/img/female.png'
                        } 
                        className={classes.avatar}
                    />
                </StyledBadge>
                {
                    isViewer
                    ?
                    <Visibility style={{ color: green[300] }} onDoubleClick={handleDoubleClickEye}/>:null                }
                { isBroadcasting ?
                    <Videocam className={classes.camera}  onDoubleClick={handleDoubleClickVideo}
                    // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: green[300] }}
                    />
                    :null
                }
                
                { isBroadcasting === 'locked'?
                    <Lock className={classes.camera}
                        // color={(user && user.broadcasting)? 'primary': 'disabled'}
                        style={{ color: yellow[700], fontSize: 17 }}
                    />
                    :null
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
                        isBlocked={isBlocked}
                        stopBroadcastTo={stopBroadcastTo}
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