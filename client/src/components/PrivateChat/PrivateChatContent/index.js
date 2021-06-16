import React, { memo, useState, useRef, useEffect, useImperativeHandle, forwardRef, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Paper,
    SvgIcon,
    Badge,
    IconButton,
    Menu,
    MenuItem
} from '@material-ui/core';
import {
    Close,
    Minimize,
    Block
} from '@material-ui/icons';
import {red, pink} from '@material-ui/core/colors'
import { useTranslation } from 'react-i18next';
import ChatForm from '../../ChatForm';
import { Rnd } from "react-rnd";
import PrivateMessageList from '../../PrivateMessageList';
import {ReactComponent as Maximium} from './square.svg'
import {ReactComponent as Restore} from './restore.svg';
import config from '../../../config';
import SettingsIcon from '@material-ui/icons/Settings';
import { SettingContext } from '../../../context';

const defaultHeight = 250;
const defaultWidth = 350;

const useStyles = makeStyles((theme) => ({
    rnd: {
        zIndex: 200,
        
    },
    root: {
        // position: 'absolute',
        // right: 'calc(50% - 200px)',
        // top: 200,
        zIndex: 200,
        height: '100%',
        // width: 400,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: theme.palette.primary.main
    },
    header: {
        height: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 7px',
        boxShadow: '1px 1px 11px 1px rgb(0 0 0 / 19%), 0px 0px 0px 0px rgb(0 0 0)',
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: '1rem',
    },
    headerContent: {
        cursor: props =>
            !props.max && 'move',
        userSelect: 'none',
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px',
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 1,
        overflow: 'hidden',
    },
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginLeft: 10,
    },
    avatarBadge: {
        '& .MuiBadge-badge': {
            width: theme.spacing(3),
            height: theme.spacing(3), 
        },
        '& .MuiSvgIcon-root': {
            fontSize: '2rem'
        }
    },
    main: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        // height: 300,
    },
    content: {
        width: '100%',
        overflow: 'auto',
        flexGrow: 1,
        position: 'relative',
        background: theme.palette.background.default,
        borderBottom: '1px solid '+ theme.palette.primary.main
    },
    hide: {
        display: 'none !important',
    },
    active: {
        zIndex: 201
    },
    min: {
        maxHeight: 40,
        width: '200px !important',
        transform: 'none !important',
    },
    max: {
        transform: 'none !important',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100% !important',
        height: '100% !important'
    },
    icon: {
        lineHeight: 0,
        padding: '4px',
        cursor: 'pointer'
    },
    badge: {
        '& span.MuiBadge-badge': {
            top: 5,
            left: 10 
        }
    },
    errorContent: {
        position: 'absolute',
        bottom: 0,
        color: red[300],
        backgroundColor: red[50],
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 17,
        paddingTop: 7,
        paddingBottom: 7
    }
}));

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

const PrivateChat = ({ me, to, ip, avatar, sendMessage, active, setActive, initMessages, deleteChat, roomName, globalBlocks }, ref) => {
    const rndRef = useRef(null);
    const winRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [hide, setHide] = useState(false);
    const [min, setMin] = useState(false);
    const [max, setMax] = useState(false);
    const [unRead, setUnRead] = useState(0);
    const [isFocus, setIsFocus] = useState(false);
    const [error, setError] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [withBlocked, setWithBlocked] = useState(false);
    const classes = useStyles({max});
    const {messageNum, addPrivateMute, removePrivateMute, privateMutes} = useContext(SettingContext);
    const { t } = useTranslation();
    const [settingAnchorEl, setSettingAnchorEl] = React.useState(null);
    const [muted, setMuted] = useState(false)

    const handleClickSetting = (event) => {
        setSettingAnchorEl(event.currentTarget);
    };
  
    const handleCloseSetting = () => {
        setSettingAnchorEl(null);
    };

    const handleIgnore = () => {
        if (muted) {
            removePrivateMute({username: to, ip})
        } else {
            addPrivateMute({username: to, ip})
        }
        setSettingAnchorEl(null);
    }

    const handleMinimize = () => {
        let top = winRef.current.getBoundingClientRect().top;
        let width = winRef.current.getBoundingClientRect().width;
        // let height = winRef.current.getBoundingClientRect().height;
        if(width>400) width = 400;
        if(min) {
            setMin(false);
            rndRef.current.updateSize({width, height: defaultHeight});
            if(window.innerHeight-top<defaultHeight)
                rndRef.current.updatePosition({y: window.innerHeight-defaultHeight});
            // setRndHeight(0);
        } else {
            setMax(false);
            setMin(true);
            rndRef.current.updateSize({width, height: 30});
            // if(window.innerHeight - top > height-40)
            //     rndRef.current.updatePosition({y: top+height-40});
            // setRndHeight(40);
        }
        // setHide(true);
    }
    const handleMaximize = () => {
        if(max) {
            setMax(false);
            // rndRef.current.updateSize({width: 400, height: 350});
        } else {
            // setMin(false)
            setMax(true);
            // rndRef.current.updateSize({width: window.innerWidth, height: window.innerHeight});
        }
    }

    const onFocus = () => {
        setIsFocus(true);
        setUnRead(0)
    }
    const onBlur = () => {
        setIsFocus(false);
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setHide(false);
        },
        hide: () => {
            setHide(true)
        },
        isShow: () => {
            return !hide;
        },
        addMessage: (message, roomName) => {
            let newMessages = [message, ...messages];
            if (newMessages.length > messageNum) {
                newMessages = newMessages.slice(0, messageNum);
            }
            setMessages(newMessages);
            if (message.from !== me.username && !isFocus) {
                setUnRead(unRead+1);
            }
            if (muted) {
                return false
            } else {
                return true
            }
        },
        addErrorMessage: () => {
            setError(true);
        },
    }));

    useEffect(() => {
        let globalBlockedNames = globalBlocks?.map(item => ((item && item.username)? item.username: null));
        let globalBlockedIps = globalBlocks?.map(item => ((item && item.ip)? item.ip: null));
        if(globalBlockedNames?.includes(to) || globalBlockedIps?.includes(ip)) {
            setWithBlocked(true);            
        } else {
            setWithBlocked(false);
        }
        if(Array.isArray(globalBlocks) && globalBlocks.includes(me.username)) {
            setBlocked(true);
        } else {
            setBlocked(false);
        }
    }, [globalBlocks, ip, me, to])

    useEffect(() => {
        if(initMessages.length) {
            setUnRead(initMessages.length)
        }
        setMessages(initMessages)
    }, [initMessages])

    useEffect(() => {
        let muted = privateMutes?.find((item) => (item.username === to || item.ip === ip))
        if (muted) setMuted (true)
        else setMuted(false)
    }, [privateMutes, to, ip])

    return (
        <Rnd
            default={{
                x: window.innerWidth/2 - 200,
                y: 200,
                width: defaultWidth,
                height: defaultHeight,
            }}
            minHeight={30}
            minWidth={250}
            // maxHeight={rndHeight ? rndHeight: null}
            dragHandleClassName="private-header"
            bounds="body"
            className={`${classes.rnd} ${max&&classes.max}  ${active&&classes.active} ${hide&&classes.hide}`}
            ref={rndRef}
            disableDragging={max}
            enableResizing={!(max||min)?{
                bottom: true,
                bottomLeft: false,
                bottomRight: true,
                left: false,
                right: true,
                top: false,
                topLeft: false,
                topRight: false,
            }: false}
        >
        {/* // <Draggable bounds="parent" disabled={max}
        //     handle='#private-header' scale={1} onMouseDown={() => {setActive(to.username)}}
        // > */}
            <Paper ref={winRef}
                className={`${classes.root}`}
                onMouseDown={() => {setActive(roomName)}}
            >
                <div className={classes.header} >
                { muted ? <StyledBadge
                        className={classes.avatarBadge}
                        badgeContent={<Block  />}
                        className={classes.avatarBadge}
                    >
                        <Avatar className={classes.smallAvatar}
                            src={avatar? config.main_site_url+avatar: '/img/default_avatar.png'}
                        />
                    </StyledBadge>
                    :
                    <Badge
                        className={classes.badge}
                        badgeContent={unRead> 9? '9+': unRead}
                        color="secondary"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Avatar className={classes.smallAvatar}
                            src={avatar? config.main_site_url+avatar: '/img/default_avatar.png'}
                        />
                    </Badge>
                }
                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickSetting} size="small" style={{color: 'white'}}>
                        <SettingsIcon fontSize="inherit" />
                    </IconButton>
                    <Menu
                        id="setting-menu"
                        anchorEl={settingAnchorEl}
                        keepMounted
                        open={Boolean(settingAnchorEl)}
                        onClose={handleCloseSetting}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                    >
                        <MenuItem onClick={handleIgnore}>{muted? 'UnMute' : 'Mute'}</MenuItem>
                    </Menu>
                    <div id="private-header" className={`private-header ${classes.headerContent}`} >{to}</div>
                    <div className={classes.icon}
                        onClick={handleMinimize}
                        style={{marginBottom: 3}}
                    >
                        <Minimize  />
                    </div>
                    <div className={classes.icon}
                        onClick={handleMaximize}
                    >
                        <SvgIcon style={{fontSize: '1.3em'}} component={max? Restore: Maximium} viewBox="0 0 600 476.6" />
                    </div>
                    <div className={classes.icon}
                        onClick={() => {
                            if(error) {
                                deleteChat(to.username, roomName);
                            }
                            else {
                                setHide(true);
                            }
                        }}
                    >
                        <Close />
                    </div>
                </div>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <PrivateMessageList messages={messages} withBlocked={withBlocked || muted} blocked={blocked} me={me}/>
                        { error &&
                            <div className={classes.errorContent}>{t('ChatApp.private_logout_error')}</div>
                        }
                    </div>
                    <ChatForm to={to} blocked={blocked} sendMessage={sendMessage} onFocus={onFocus} onBlur={onBlur} roomName={roomName}
                        type='private'
                    />
                </div>
                
            </Paper>
        {/* </Draggable> */}
        </Rnd>
    );
}

const PrivateChatWithRef = forwardRef(PrivateChat);
export default memo(PrivateChatWithRef);