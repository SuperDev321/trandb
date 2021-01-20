import React, { memo, useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar,
    Paper,
    SvgIcon,
    Badge
} from '@material-ui/core';
import {
    Close,
    Minimize
} from '@material-ui/icons';
import ChatForm from '../../ChatForm';
import Draggable from 'react-draggable';
import PrivateMessageList from '../../PrivateMessageList';
import {getPrivateMessages} from '../../../utils';
import {ReactComponent as Maximium} from './square.svg'
import {ReactComponent as Restore} from './restore.svg'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        right: 'calc(50% - 200px)',
        top: 200,
        zIndex: 200,
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        height: 45,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 7px',
        boxShadow: '1px 1px 11px 1px rgb(0 0 0 / 19%), 0px 0px 0px 0px rgb(0 0 0)',
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
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
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginLeft: 10,
    },
    main: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 300,
    },
    content: {
        width: '100%',
        overflow: 'auto',
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    active: {
        zIndex: 201
    },
    min: {
        maxHeight: 45,
        width: '200px !important',
        transform: 'none !important',
    },
    max: {
        transform: 'none !important',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minWidth: '100%',
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
    }
}));

const PrivateChat = ({ me, to, sendMessage, active, setActive, initVal }, ref) => {
    const winRef = useRef();
    const [messages, setMessages] = useState([]);
    const [hide, setHide] = useState(false);
    const [min, setMin] = useState(false);
    const [max, setMax] = useState(false);
    const [unRead, setUnRead] = useState(0);
    const classes = useStyles({max});

    const handleMinimize = () => {
        // if(min) {
        //     setMin(false);
        // } else {
        //     setMax(false);
        //     setMin(true);
        // }
        setHide(true);
    }
    const handleMaximize = () => {
        if(max) {
            setMax(false);
        } else {
            setMin(false)
            setMax(true);
        }
    }

    const onFocus = () => {
        setUnRead(0)
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setHide(false);
        },
        isShow: () => {
            return !hide;
        },
        addMessage: (message) => {
            setMessages([...messages, message]);
            if(message.from!==me.username)
                setUnRead(unRead+1);
        }
    }));

    useEffect(() => {
        getPrivateMessages({from: me.username, to},
            (data) => {
                setMessages(data);
            },
            (err) => {
                console.log(err);
            }
        );
    }, [me, to])

    useEffect(() => {
        if(initVal) {
            setUnRead(initVal)
        }
    }, [initVal])

    // useEffect(() => {
    //     if(active) {
    //         setUnRead(0);
    //     }
    // }, [active])
    return (
        <Draggable bounds="parent" disabled={max}
            handle='#private-header' scale={1} onMouseDown={() => {setActive(to.username)}}
        >
            <Paper ref={winRef}
                className={`${classes.root} ${hide&&classes.hide} ${active&&classes.active} ${max && classes.max} ${min && classes.min}`}
            >
                <div className={classes.header} >
                    <Badge badgeContent={unRead> 9? '9+': unRead} color="secondary"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        className={classes.badge}
                    >
                        <Avatar className={classes.smallAvatar}
                            src='/img/default_avatar.png'
                        />
                    </Badge>
                    <div id="private-header" className={classes.headerContent}>{to}</div>
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
                        onClick={()=>{setHide(true);}}
                    >
                        <Close />
                    </div>
                </div>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <PrivateMessageList messages={messages} me={me}/>
                    </div>
                    <ChatForm to={to} sendMessage={sendMessage} onFocus={onFocus}/>
                </div>
                
            </Paper>
        </Draggable>
    );
}

const PrivateChatWithRef = forwardRef(PrivateChat);
export default memo(PrivateChatWithRef);