import React, {useState, useContext, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Switch,
    Grid,
    Button
} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import { FileUploader } from '../../../components'
import { handleUpdateAvatar } from '../../../utils';
import { UserContext } from '../../../context';
const useStyles = makeStyles((theme) => ({
    root: {
        // width: '100%',
        padding: 20
    },
    fileUploader: {
        color: 'white',
        '& .MuiInput-root': {
            color: 'white',
            '&::before': {
                borderBottomStyle: 'solid',
                borderColor: 'white'
            }
        },
        '& .MuiButton-root': {
            color: 'white',
            borderColor: 'white'
        },
    },
    outlinedButton: {
        color: 'white',
        borderColor: 'white'
    }
}))
const AvatarSetting = ({avatarOption}) => {
    const classes = useStyles();
    const [allowUpload, setAllowUpload] = React.useState(false);
    const [avatarFile, setAvatarFile] = React.useState(null);
    const { username, updateUser, myUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const { t } = useTranslation();

    const handleSave = () => {
        const data = {
            type: allowUpload,
            username,
            avatar: avatarFile
        }
        handleUpdateAvatar(data, () => {
            updateUser()
        }, (err) => {
            console.log(err)
        });
    }

    useEffect(() => {
        if (!avatarOption) {
            setAllowUpload(false)
            setLoading(false)
        }
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
    }, [myUser, avatarOption])

    return (
        <div className={classes.root}>
            <Grid container alignItems="center" spacing={0}>
                <Grid item xs={12}>
                    <span>Avatar Option</span>
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>From Main Site</Grid>
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
                    <Grid item>Upload</Grid>
                  </Grid>
                </Grid>
                { allowUpload &&
                <Grid item xs={12} className={classes.fileUploader}>
                    <FileUploader title={"New"} value={avatarFile}
                        handleFile={(file) => {setAvatarFile(file)}}
                    />
                </Grid>
                }
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.outlinedButton}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}
export default AvatarSetting;