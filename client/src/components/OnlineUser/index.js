import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Popover,
    Card,
    CardMedia,
    Button,
    Divider,
    Badge,
} from '@material-ui/core';
import { deepOrange, pink, blue, green, grey } from '@material-ui/core/colors';
import {QuestionAnswer,
    AccountCircleOutlined,
    Videocam,
    Block,
    Check,
    Notifications,
    StarRounded,
    Visibility,
    VisibilityOff
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
        width: theme.spacing(3),
        height: theme.spacing(3),
        
        minWidth: 0
    },
    avatarBadge: {
        '& .MuiBadge-badge': {
           width: theme.spacing(3),
            height: theme.spacing(3), 
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
        changeMuteState, sendPokeMessage, kickUser, banUser,
        // , setOpenPrivate, setPrivateTo
        addOrOpenPrivate,
    }) => {
    const classes = useStyles({role: user.role});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openBan, setOpenBan] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickPrivateChat = (event) => {
        setAnchorEl(null);
        event.preventDefault();
        setTimeout(() => {
            addOrOpenPrivate(user);
        }, 0);
    }
    const handleMute = () => {
        setAnchorEl(null);
        setTimeout(() => {
            changeMuteState(roomName, user);
        }, 0)
    }
    const handleKick = (username) => {
        setAnchorEl(null);
        setTimeout(() => {
            kickUser(roomName, username);
        }, 0)
    }
    const handleBan = (username) => {
        setAnchorEl(null);
        if(role === 'admin') {
            setOpenBan(true);
        } else {
            setTimeout(() => {
                if(role)
                banUser(roomName, username);
            }, 0);
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickProfile = () => {
        if(user && user.username)
            window.open('/profile/'+user.username);
        setAnchorEl(null);
    }

    const sendPoke = () => {
        setAnchorEl(null);
        setTimeout(() => {
            sendPokeMessage(roomName, user.username);
        }, 0)
        
    }

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
                    <Visibility style={{ color: green[300] }}/>
                    :
                    <VisibilityOff style={{ color: grey[200] }}/>
                }
                
                <Videocam className={classes.camera}
                    // color={(user && user.broadcasting)? 'primary': 'disabled'}
                    style={{ color: (isBroadcasting)? green[300]:grey[200] }}
                />
                <div className={classes.username}
                // onClick={handleClick}
                >
                    {/* <span>{user.username+(username===user.username ? ' (you)' : '')}</span> */}
                    <RoomUserName
                        user={user}
                        roomName={roomName}
                        isMine={username === user.username}
                        displayYou={true}
                        changeMuteState={changeMuteState}
                        sendPokeMessage={sendPokeMessage}
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
            {/* <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <Card className={classes.cardRoot}>
                    <CardMedia
                        className={classes.cardHeader}
                    >
                        <Avatar alt="User Avatar" src={
                            user.avatar
                            ? user.avatar
                            :'/img/default_avatar.png'
                        } />
                        <span>{user.gender}</span>
                    </CardMedia>
                    <Divider />
                    <Button size="small" color="primary" fullWidth className={classes.cardButton} onClick={handleClickProfile}>
                        <AccountCircleOutlined />&nbsp;Profile
                    </Button>
                    { user.username != username &&
                        <>
                            <Divider />
                            <Button size="small"
                                color="primary"
                                fullWidth
                                className={classes.cardButton}
                                onClick={ handleClickPrivateChat}
                            >
                                <QuestionAnswer />&nbsp;Private Chat
                            </Button>
                            <Button size="small" fullWidth
                                color="primary"
                                className={classes.cardButton}
                                onClick={() => {sendPoke()}}
                            >
                                <Notifications />&nbsp;Poke Message
                            </Button>
                            <Divider />
                            { (role === 'admin' || role === 'owner' || role === 'moderator')
                                && (user.role !== 'admin') && (user.role !== 'owner') &&
                                <>
                                <Button size="small"
                                    className={`${classes.cardButton} ${classes.kick}`}
                                    fullWidth onClick={() => { handleBan(user.username) }}
                                    name={user.username}
                                >
                                    Ban/Block
                                </Button>
                                <Button size="small"
                                        className={`${classes.cardButton} ${classes.kick}`}
                                        fullWidth onClick={() => { handleKick(user.username) }}
                                        name={user.username}
                                    >
                                        Kick
                                </Button>
                                </>
                            }
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={() => { handleMute(user.username) }}
                                name={user.username}
                            >
                            {
                                user.muted
                                ? 'Unmute / Ignore'
                                : 'Silence / Ignorance'
                            }
                            </Button>
                        </>
                    }
                </Card>
            </Popover>
            <BanModal open={openBan} setOpen={setOpenBan} initVal={{name: user.username, ip: user.ip}} 
                roomName={roomName}
            /> */}
            {/* <RoomUserPopover
                user={user}
                roomName={roomName}
                isMine={username === user.usernmae}
                changeMuteState={changeMuteState}
                sendPokeMessage={sendPokeMessage}
                kickUser={kickUser}
                banUser={banUser}
                addOrOpenPrivate={addOrOpenPrivate}
                role={role}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                open={open}
                handleClose={handleClose}
            /> */}
        </div>
    );
}

export default OnlineUser;