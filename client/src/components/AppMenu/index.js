import React, { useState, useContext } from 'react';
import {
    Button,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    SvgIcon,
} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import {UserContext} from '../../context';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {ReactComponent as Money} from '../../icons/money.svg';
import EditProfileModal from '../Modals/EditProfileModal';

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: 1
    },
    username: {
        color: theme.palette.primary.text,
        textTransform: 'none',
        whiteSpace: 'nowrap'
    },
    dropIcon: {
        color: theme.palette.primary.text,
        marginLeft: theme.spacing(0.5),
    },
    menu: {
        minWidth: '120px'
    },
    point: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        '& svg': {
            paddingRight: 2
        },
        color: '#edba31'
    }
}))

export default function AppMenu() {
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const {t} = useTranslation()
    const [openEdit, setOpenEdit] = useState(false);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };
    

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    const { removeCurrentUser, avatar, username, point } = useContext(UserContext);

    const handleClickProfile = () => {
        if(username) {
            window.open('/profile/'+username);
        }
        setOpen(false);
    }

    const handleClickEditProfile = () => {
        if (username) {
            setOpenEdit(true)
        }
        setOpen(false);
    }

    const handleCloseEditProfile = () => {
        setOpenEdit(false);
    }

    const logout = async () => {
        try {
            let token = window.localStorage.getItem('token');
            await axios.get('/api/logout' , {
                headers: {
                    "Authorization" : token
                }
            });
            removeCurrentUser();
        } catch (err) {
            message.error('Something went wrong, please try again later');
        }
    }

    return (
        <div>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <UserAvatar avatar={avatar} />
                
                <div className={classes.content}>
                    <span className={classes.username}>
                        {username}
                    </span>
                    <div className={classes.point}>
                        <SvgIcon style={{fontSize: '1.3em'}} component={Money} viewBox="0 0 600 476.6" />
                        <span>{point ? point: 0}</span>
                    </div>
                </div>
                <ArrowDropDownIcon className={classes.dropIcon} />
            </Button>
            <Popper open={open} style={{zIndex: 100}} anchorEl={anchorRef.current} role={undefined} transition>
            {
                ({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                <Paper >
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList 
                            className={classes.menu} autoFocusItem={open}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDown}
                        >
                            <MenuItem onClick={handleClickProfile}>{t('global.profile')}</MenuItem>
                            <MenuItem onClick={handleClickEditProfile}>{t('global.edit_profile')}</MenuItem>
                            <MenuItem onClick={logout}>{t('global.logout')}</MenuItem>
                            
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
            <EditProfileModal open={openEdit} handleClose={handleCloseEditProfile} />
        </div>
    );
}