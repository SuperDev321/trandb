import React, { useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {
    TextField,
    Grid,
    Container,
    Paper,
    Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getUser, handleUpdateProfile } from '../../apis';
import { FileUploader } from '../../components'
const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(8),
        color: 'white',
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        _msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none'  /* Firefox */
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3),
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        marginRight: 20
    }
}))


const EditProfile = () => {
    const {username: profileUsername} = useParams();
    const [currentAvatar, setCurrentAvatar] = React.useState('');
    const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();
    const validationSchema = yup.object({
        username: yup
        .string('Enter your nick name.')
        .required(t('CreateRoom.error2')),
        category: yup
        .string('Please select category')
        .required(t('CreateRoom.error3'))
    });
    const formik = useFormik({
        initialValues: {
            username: profileUsername,
            avatar: null,
        },
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            handleUpdateProfile(values, () => history.push(`/profile/${profileUsername}`), (err) => {
                console.log(err)
            });
        },
    });

    return (
        <Container className={classes.root}  maxWidth="sm">
            <h1 style={{backgroundColor: 'white', color: 'black'}}>Edit Profile</h1>
            <Paper className={classes.content}>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <Grid container spacing={4}>
                        {/* <Grid item xs={12} sm={12}>
                            <TextField
                                autoComplete='off'
                                id="username"
                                name="username"
                                fullWidth
                                label="username"
                                value={formik.values.username}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            >
                            </TextField>
                        </Grid> */}
                        <Grid item xs={12}>
                            <FileUploader title={"Avatar"} value={formik.values.avatar}
                                handleFile={(file) => {formik.setFieldValue('avatar', file, false)}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Update
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {history.push(`/profile/${profileUsername}`)}}
                            >
                                Back
                            </Button>
                        </Grid>
                        
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default EditProfile;