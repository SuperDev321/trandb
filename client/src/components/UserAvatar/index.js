import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import config from '../../config';
import { SettingContext, UserContext } from '../../context';

const useStyles = makeStyles((theme) => ({
    root: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}))

const UserAvatar = ({avatar}) => {
    const classes = useStyles();
    const { avatarOption, avatarColor } = useContext(SettingContext);
    const { myUser } = useContext(UserContext)
    const [avatarUrl, setAvatarUrl] = useState(null)

    useEffect(() => {
        const setRealAvatar = () => {
            if (typeof myUser === 'object' && myUser !== null) {
                const {avatarObj, currentAvatar, gender} = myUser
                if (!avatarOption) {
                    // self avatar
                    if (avatarObj[currentAvatar]) {
                        if (currentAvatar === 'default') {
                            return setAvatarUrl(config.image_path + 'avatar/' + avatarObj[currentAvatar])
                        } else if (currentAvatar === 'joomula') {
                            return setAvatarUrl(config.main_site_url+avatarObj[currentAvatar])
                        }
                    } else {
                        
                    }
                } else {
                    // joomula avatar
                    if (avatarObj.joomula) {
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
    }, [myUser, avatarOption, avatarColor])

    return (
        <Avatar
            className={classes.root}
            src={ avatarUrl }
            alt='user avatar'
        ></Avatar>
    );
}

export default UserAvatar;