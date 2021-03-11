import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}))

const UserAvatar = ({avatar}) => {
    const classes = useStyles();

    return (
        <Avatar
            className={classes.root}
            src={ avatar ?
                config.main_site_url+'img/avatars/'+avatar:
                '/img/default_avatar.png'
            }
            alt='user avatar'
        ></Avatar>
    );
}

export default UserAvatar;