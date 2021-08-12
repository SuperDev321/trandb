import React, { useState, useEffect, useContext } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Switch,
    Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next';
import { FileUploader } from '../../../components'
import { handleUpdateProfile } from '../../../apis';
import { SettingContext, UserContext } from '../../../context';
import config from '../../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        direction: 'ltr'
    },
    content: {
        display: 'flex'
    },
    textField: {
        marginTop: 0,
        fontWeight: 500,
        background: 'transparent',
        color: 'white',
        direction: 'ltr',
        paddingBottom: 20
    },
    fileUploader: {
        // color: 'white',
        // '& .MuiInput-root': {
        //     // color: 'white',
        //     '&::before': {
        //         borderBottomStyle: 'solid',
        //         borderColor: 'white'
        //     }
        // },
        // '& .MuiButton-root': {
        //     color: 'white',
        //     borderColor: 'white'
        // },
        paddingBottom: 20
    },
    outlinedButton: {
        margin: 10
    }
}))

const EditProfileModal = ({ open, handleClose }) => {
    const [aboutMe, setAboutMe] = useState('');
    const [allowUpload, setAllowUpload] = React.useState(false);
    const [avatarFile, setAvatarFile] = React.useState(null);
    const { username, myUser, role } = useContext(UserContext);
    const { avatarOption, allowGuestAvatarUpload } = useContext(SettingContext);
    const [loading, setLoading] = useState(true)
    const classes = useStyles();
    const { t } = useTranslation();

    const handleSave = () => {
        const data = {
            avatarType: allowUpload,
            username,
            avatar: avatarFile,
            aboutMe
        }
        handleUpdateProfile(data, () => {
        }, (err) => {
            console.log(err)
        });
        handleClose()
    }

    useEffect(() => {
        if (avatarOption) {
            setAllowUpload(false)
            setLoading(false)
        } else {
            if (myUser && typeof myUser === 'object') {
                const { currentAvatar } = myUser;
                if (currentAvatar === 'default') {
                    setAllowUpload(true)
                    setLoading(false)
                } else if (currentAvatar === 'joomula') {
                    setAllowUpload(false)
                    setLoading(false)
                }
            }
        }
    }, [myUser, avatarOption])

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" className={classes.root}>
            <DialogTitle id="edit-profile-title">{t('global.edit_profile')}</DialogTitle>
            <DialogContent>
                <div className={classes.content}>
                    <Grid container>
                        {
                        (role && (role !=='guest')) && 
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="aboutMe"
                                label={t('LoginPage.about_me')}
                                id="login-about-me"
                                autoComplete="off"
                                value={aboutMe}
                                className={classes.textField}
                                onChange={(e) => setAboutMe(e.target.value)}
                                inputProps={{ maxLength: config.aboutMe_length }}
                            />
                        </Grid>
                        }
                        { (role && (role !=='guest' || allowGuestAvatarUpload)) &&
                        <>
                        <Grid item xs={12}>Avatar</Grid>
                        <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <Grid item>{t('SettingModal.from_main_site')}</Grid>
                            <Grid item>
                            <Switch
                                checked={allowUpload}
                                onChange={(e) => {setAllowUpload(e.target.checked)}}
                                color="secondary"
                                name="avatar-check"
                                inputProps={{ 'aria-label': 'avatar checkbox' }}
                                disabled={avatarOption}
                            />
                            </Grid>
                            <Grid item>{t('SettingModal.upload')}</Grid>
                        </Grid>
                        </Grid>
                        {!avatarOption && allowUpload &&
                        <Grid item xs={12} className={classes.fileUploader}>
                            <FileUploader title={"New"} value={avatarFile}
                                handleFile={(file) => {setAvatarFile(file)}}
                            />
                        </Grid>
                        }
                        </>
                        }
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.outlinedButton}
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {t('global.save')}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.outlinedButton}
                                onClick={handleClose}
                                disabled={loading}
                            >
                                {t('global.cancel')}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileModal;