import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
} from "@material-ui/core";
import AppMenu from '../AppMenu';
import { makeStyles } from '@material-ui/core/styles';
import SettingModal from '../Modals/SettingModal';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    appBar: {
        flexDirection: 'row',
        display: `flex`,
        justifyContent: `space-between`,
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        flexWrap: 'wrap',
        height: '50px'
    },
    title: {
        flexGrow: 1,
        minHeight: '50px'
    },
    logo : {
        cursor: 'pointer',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    grow: {
        flexGrow: 1,
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 5,
        overflow: 'hidden'

    },
    sectionDesktop: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
          display: 'flex',
        },
      },
      sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
          display: 'none',
        },
    },
}));
const HomeLayout = ({children, unReadMsgs, openPrivate, messageSize, setMessageSize}) => {
    
    const classes = useStyles();
    const history = useHistory();
    const [frameShow, setFrameShow] = useState(false);
    useLayoutEffect(() => {
        setFrameShow(true)
    }, [])
    
    useEffect(() => {
        const resetMessageSize = async (size) => {
                
            setMessageSize(size)
        };
        
        resetMessageSize(messageSize);
    }, [messageSize, setMessageSize])
    return (
    <div className={classes.root} style={{ fontSize: messageSize }}>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar  className={classes.title}>
                <img
                    src="/img/logo.png"
                    alt="logo"
                    className={classes.logo}
                    onClick={()=>history.push('/')}
                />
                <div className={classes.grow} >
                {/* { frameShow &&
                    <iframe title="header-title" src="https://widget.walla.co.il/fxp4" height="40px" width="100%" frameBorder={0} scrolling="no" />
                } */}
                </div>
                <div className={classes.sectionDesktop}>
                    <SettingModal />
                    {/* <PrivateMails unReadMsgs={unReadMsgs} openPrivate={openPrivate} /> */}
                    {/* <IconButton aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={unReadMsgs.length} color="secondary">
                            <Mail />
                        </Badge>
                    </IconButton> */}
                </div>
                <AppMenu />
            </Toolbar>
            
        </AppBar>
        {children}
    </div>
    )
}

export default HomeLayout;
