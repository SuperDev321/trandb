import React, { useContext } from 'react';
import {
    Button,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList
} from '@material-ui/core';
import UserAvatar from '../UserAvatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import {UserContext} from '../../context';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    username: {
        color: theme.palette.primary.text,
        textAlign: 'end',
        marginLeft: theme.spacing(0.5),
        marginTop: '2px',
        textTransform: 'none',
        whiteSpace: 'nowrap'
    },
    dropIcon: {
        color: theme.palette.primary.text,
        marginLeft: theme.spacing(0.5),
    },
    menu: {
        minWidth: '120px'
    }
}))

export default function AppMenu() {
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const {t} = useTranslation()
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

    const { removeCurrentUser, avatar, username } = useContext(UserContext);

    const handleClickProfile = () => {
        if(username) {
            window.open('/profile/'+username);
        }
        setOpen(false);
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
                <span className={classes.username}>
                    {username}
                </span>
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
                            <MenuItem onClick={logout}>{t('global.logout')}</MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
        </div>
    );
}