import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import {
    Avatar,
    Popover,
    Card,
    CardMedia,
    Button,
    Divider,
    Fade
} from '@material-ui/core';
import {
    QuestionAnswer,
    AccountCircleOutlined,
    Videocam,
    Notifications,
    VisibilityOff,
    CardGiftcard
} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { green, pink, red, yellow } from '@material-ui/core/colors';
import BanModal from '../Modals/BanModal';
import CustomTooltip from '../CustomTooltip'
import {socket} from '../../utils'
import config from '../../config';
import { ChatContext, SettingContext } from '../../context';
const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        cursor: 'pointer',
    },
    username: {
        fontWeight: 'bold',
        fontSize: '1em',
        lineHeight: 1.4,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
    },
    aboutMe: {
        fontSize: '0.7rem',
        color: theme.palette.textColor.sub,
        textAlign: 'center'
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
    pokeContent: {
        width: 200
    },
    userPoint: {
        fontWeight: 'bold',
        fontSize: '0.7rem',
        color: '#fbc02d',
        paddingLeft: 3,
        paddingRight: 3,
    },
    userPointK: {
        color: '#008000'
    },
    userPointV: {
        color: red[500]
    }
}))

const pokeTypes = [
    'default',
    'good_morning',
    'where_are_you',
    'nock'
]

const extractPoint = (point) => {
    if (point > 100000) {
        return { point: Math.floor(point/100000) + 'V', pointRange: 'V' };
    } else if (point > 1000) {
        return { point: Math.floor(point/1000) + 'K', pointRange: 'K' };
    } else if (point > 100) {
        return { point: Math.floor(point/100) + 'L', pointRange: 'L' };
    } else {
        return { point: Math.floor(point), pointRange: 'L' };
    }
}

function useDoubleClick({oneClick, doubleClick}) {
    const [elem, setElem] = React.useState(null);
    const countRef = React.useRef(0);
    const timerRef = React.useRef(null);
    const inputDoubleCallbackRef = React.useRef(null);
    const inputClickCallbackRef = React.useRef(null);
    const callbackRef = React.useCallback(node => {
      setElem(node);
      callbackRef.current = node;
    }, []);
  
    React.useEffect(() => {
        inputClickCallbackRef.current = oneClick;
    }, [oneClick]);

    React.useEffect(() => {
        inputDoubleCallbackRef.current = doubleClick
    }, [doubleClick])
  
    React.useEffect(() => {
        function handler(event) {
            const isDoubleClick = countRef.current + 1 === 2;
            const timerIsPresent = timerRef.current;
            if (timerIsPresent && isDoubleClick) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
                countRef.current = 0;
                if (inputDoubleCallbackRef.current) {
                    inputDoubleCallbackRef.current(event);
                }
            }
            if (!timerIsPresent) {
                countRef.current = countRef.current + 1;
                const timer = setTimeout(() => {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                    countRef.current = 0;
                    if(inputClickCallbackRef.current && elem) {
                        inputClickCallbackRef.current(event);
                    }
                }, 200);
                timerRef.current = timer;
            }
        }
        if (elem) {
            elem.addEventListener("click", handler);
        }
  
        return () => {
            if (elem) {
            elem.removeEventListener("click", handler);
            }
        };
    }, [elem]);
    return [callbackRef, elem];
}

const RoomUserName = ({user, role, roomName,
    changeMuteState, sendPokeMessage, kickUser, banUser, addOrOpenPrivate, viewBroadcast, stopBroadcastTo,
    isMine, displayYou, isMuted, isBlocked, isPrivateMuted, changePrivateMute, showAboutMe, showPoint = false
}) => { 
    const classes = useStyles();
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorPokeEl, setAnchorPokeEl] = React.useState(null)
    const [openBan, setOpenBan] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const { avatarOption, avatarColor, pointOption } = useContext(SettingContext);
    const { setOpenGiftModal, setGiftUsername, setRoomNameForGift } = useContext(ChatContext);
    const handleDbClick = (event) => {
        handleClickPrivateChat(event);
    }
    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    const [refCallback, elem] = useDoubleClick({doubleClick: handleDbClick, oneClick: handleClick});
    const handleClickPrivateChat = (event) => {
        setAnchorEl(null);
        event.preventDefault();
        if (!isMine) {
             setTimeout(() => {
                addOrOpenPrivate(user);
            }, 0);
        }
    }
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMute = () => {
        setAnchorEl(null);
        setTimeout(() => {
            changeMuteState(roomName, user, isMuted);
        }, 0)
    }
    const handleMutePrivate = () => {
        setAnchorEl(null);
        setTimeout(() => {
            changePrivateMute(user, isPrivateMuted)
        }, 0)
    }
    //block a user
    const blockUser = () => {
        socket.emit('block user', {room: roomName, username: user.username},
        (result, message) => {
            if(!result) {
                // enqueueSnackbar(message, {variant: 'error'});
            }
        })
    } 
    const unBlockUser = (roomName, username) => {
        socket.emit('unblock user', {room: roomName, username: user.username},
            (result, message) => {
                if(!result) {
                    // enqueueSnackbar(message, {variant: 'error'});
                }
            }
        );
    }
    const handleBlock = () => {
        if(!isBlocked) {
            blockUser(roomName, user.username);
        } else {
            unBlockUser(roomName, user.username);
        }
        setAnchorEl(null);
    }
    const handleKick = () => {
        setAnchorEl(null);
        setTimeout(() => {
            kickUser(roomName, user.username);
        }, 0)
    }
    const handleBan = () => {
        setAnchorEl(null);
        // if(role === 'admin' || role === 'super_admin') {
            setOpenBan(true);
        // } else {
        //     setTimeout(() => {
        //         if(role && user && user.username)
        //             banUser(roomName, user.username);
        //     }, 0);
        // }
    }

    const handleClickProfile = () => {
        if(user && user.username)
            window.open('/profile/'+user.username);
        setAnchorEl(null);
    }

    const sendPoke = (poke) => {
        setAnchorEl(null);
        setAnchorPokeEl(null);
        setTimeout(() => {
            sendPokeMessage(roomName, user.username, poke);
        }, 0)
    }

    const view = () => {
        setAnchorEl(null);
        setTimeout(() => {
            viewBroadcast(roomName, user._id, user.username);
        }, 0);
    }

    const gift = () => {
        setAnchorEl(null);
        setTimeout(() => {
            setGiftUsername(user.username)
            setRoomNameForGift(roomName)
            setOpenGiftModal(true)
        }, 0)
    }

    const stopView = () => {
        setAnchorEl(null);
        setTimeout(() => {
            stopBroadcastTo(roomName, user._id, user.username);
        }, 0);
    }

    const handleClickPoke = (event) => {
        setAnchorPokeEl(event.currentTarget);
    }

    const handleClosePokeContent = () => {
        setAnchorPokeEl(null);
    };

    const unbanCamera = () => {
        setAnchorEl(null);
        socket.emit('unban camera', {room: roomName, username: user.username}, (result, message) => {

        });
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
                    if (avatarObj && avatarObj.joomula) {
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
    const openPoke = Boolean(anchorEl && anchorPokeEl);
    const { point, pointRange } = extractPoint(user.point);

    return (
        <>
        <CustomTooltip
            disabled={(role && user && user.ip)? (role !== 'admin' && role !== 'super_admin'): true}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title={user.ip}
        >
            <div  ref={refCallback} className={classes.content}>
                { (pointOption && showPoint && user.point && user.point > 0)
                    ?
                    <span
                        className={clsx(classes.userPoint, {
                            [classes.userPointV]: pointRange === 'V',
                            [classes.userPointK]: pointRange === 'K',
                            })
                        }
                        >
                        {point}
                    </span>
                    :null
                }
                <span className={classes.username}>
                    {user.username+((isMine && displayYou) ? ' (you)' : '')}
                </span>
                { showAboutMe && user.aboutMe && user.aboutMe !== '' &&
                    <span className={classes.aboutMe}>{user.aboutMe}</span>
                }
            </div>
        </CustomTooltip>
        <Popover
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
                    <Avatar alt="User Avatar" src={avatarUrl} />
                    <span>{user.username}</span>
                </CardMedia>
                <Divider />
                <Button size="small" color="primary" fullWidth className={classes.cardButton} onClick={handleClickProfile}>
                    <AccountCircleOutlined />&nbsp;{t('UserActionArea.view_profile')}
                </Button>
                { !isMine &&
                    <>
                        <Divider />
                        <Button size="small"
                            color="primary"
                            fullWidth
                            className={classes.cardButton}
                            onClick={ handleClickPrivateChat}
                        >
                            <QuestionAnswer />&nbsp;{t('UserActionArea.message')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            aria-describedby="poke-content" onClick={handleClickPoke}
                        >
                            <Notifications />&nbsp;{t('UserActionArea.poke')}
                        </Button>
                        <Popover
                            id="poke-content"
                            open={openPoke}
                            anchorEl={anchorPokeEl}
                            onClose={handleClosePokeContent}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <div className={classes.pokeContent}>
                            {
                                pokeTypes.map((poke) => (
                                    <Button size="small" key={poke} fullWidth
                                        color="primary"
                                        className={classes.cardButton}
                                        onClick={() => {sendPoke(poke)}}
                                    >
                                        {t(`UserActionArea.${poke}`)}
                                    </Button>
                                ))
                            }
                            </div>
                        </Popover>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {view()}}
                        >
                            <Videocam />&nbsp;{t('UserActionArea.view')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {stopView()}}
                        >
                            <VisibilityOff />&nbsp;{t('UserActionArea.stopView')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {gift()}}
                        >
                            <CardGiftcard />&nbsp;{t('UserActionArea.gift')}
                        </Button>
                        <Divider />
                        { ((role === 'super_admin' || role === 'admin' || role === 'owner' || role === 'moderator')
                            && (user.role !== 'super_admin') && (user.role !== 'admin') && (user.role !== 'owner')) ?
                            <>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.kick}`}
                                fullWidth onClick={() => { handleBan() }}
                            >
                                {t('UserActionArea.ban_from_room')}
                            </Button>
                            <Button size="small"
                                    className={`${classes.cardButton} ${classes.kick}`}
                                    fullWidth onClick={() => { handleKick() }}
                                >
                                    {t('UserActionArea.kick_from_room')}
                            </Button>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={handleBlock}
                            >
                            {
                                isBlocked
                                ? t('UserActionArea.unblock_this_person')
                                : t('UserActionArea.block_this_person')
                            }
                            </Button>
                            {user.isCameraBanned ? 
                                <Button size="small"
                                    className={`${classes.cardButton} ${classes.mute}`}
                                    fullWidth onClick={unbanCamera}
                                >
                                { t('UserActionArea.unban_camera')}
                                </Button>
                            :
                            null
                            }
                            
                            </>
                        :
                            <>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={() => { handleMute() }}
                            >
                            {
                                isMuted
                                ? t('UserActionArea.unmute_this_person')
                                : t('UserActionArea.mute_this_person')
                            }
                            </Button>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={() => { handleMutePrivate() }}
                            >
                            {
                                isPrivateMuted
                                ? t('UserActionArea.unmute_private')
                                : t('UserActionArea.mute_private')
                            }
                            </Button>
                            </>
                        }
                    </>
                }
            </Card>
        </Popover>
        {(role === 'admin' || role === 'super_admin'|| role === 'owner'|| role === 'moderator') && <BanModal open={openBan} setOpen={setOpenBan} initVal={{name: user.username}}
            roomName={roomName} isAdmin={(role === 'admin' || role === 'super_admin')}
        />
        }
        </>
    )
}

export default RoomUserName;