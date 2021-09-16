import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import getUser from '../../apis';
import UserAvatar from '../UserAvatar';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    username: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    }
}))
const AvatarAndName = ({username}) => {
    const [avatar, setAvatar] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        if(username) {
            getUser(username,
            (data) => {
                setAvatar(data.avatar);
            },
            (err) => {
                console.log(err);
            });
        }
    }, [username])


    return (
        <div className={classes.root}>
            <UserAvatar avatar={avatar} className={classes.avatar} />
            <span className={classes.username}>
                {username && username}
            </span>
        </div>
    )
}
export default AvatarAndName;