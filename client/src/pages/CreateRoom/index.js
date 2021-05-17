import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    Card,
    MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '../../components'
import { handleCreateRoom } from '../../utils';


const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(8),
        color: 'white'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3),
        // backgroundColor: '#3b56a2ef'
    },
    headerText: {
        // color: 'white'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textField: {
        marginTop: 0,
        fontWeight: 500,
        background: 'transparent',
        color: 'white'
    },
    label: {
        color: 'white !important'
    },
    input: {
        color: 'white'
    }
}));

const categorys = [
    'comedy',
    'entertainment',
    'gaming',
    'social',
    'technology',
    'teen',
    'other',
];

const CreateRoom = () => {
    const history = useHistory();
    const classes = useStyles();
    const { t } = useTranslation();
    
    const maxUsers = [
        {title: t('CreateRoom.unlimited'), value: 9999},
        {title: '5', value: 5},
        {title: '10', value: 10},
        {title: '15', value: 15},
        {title: '25', value: 25},
        {title: '50', value: 50},
        {title: '100', value: 100},
        {title: '150', value: 150},
        {title: '200', value: 200},
    ]
    
    const validationSchema = yup.object({
        name: yup
        .string('Enter your nick name.')
        .required(t('CreateRoom.error2')),
        category: yup
        .string('Please select category')
        .required(t('CreateRoom.error3'))
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            category: 'comedy',
            maxUsers: 9999,
            password: '',
            description: '',
            welcomeMessage: '',
            cover: null,
            icon: null,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
           console.log(values);
            handleCreateRoom(values, () => history.push('/rooms'), message.error);
        },
    });

    return (
        <Container component="main" className={classes.root} maxWidth="xs">
        <CssBaseline />
        <Card className={classes.card}>
            {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5" className={classes.headerText}>
                {t('CreateRoom.create_a_room')}
            </Typography>
            <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                    <TextField
                        autoComplete="off"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        label={t('CreateRoom.room_name')}
                        className={classes.textField}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="off"
                            name="maxUsers"
                            required
                            fullWidth
                            select
                            id="maxUsers"
                            type="number"
                            label={t('CreateRoom.max_users')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.textField}
                            value={formik.values.maxUsers}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.maxUsers && Boolean(formik.errors.maxUsers)}
                            helperText={formik.touched.maxUsers && formik.errors.maxUsers}
                        >
                            {maxUsers.map((item) => (
                                <MenuItem key={item.title} value={item.value}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label={t('CreateRoom.category')}
                            id="category"
                            name='category'
                            className={classes.textField}
                            value={formik.values.category}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.maxUsers && Boolean(formik.errors.maxUsers)}
                            helperText={formik.touched.maxUsers && formik.errors.maxUsers}
                        >
                            {categorys.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {t('CreateRoom.'+category)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="password"
                        label={t('CreateRoom.password')}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        multiline
                        name="welcomeMessage"
                        label={t('CreateRoom.welcome_message')}
                        type="welcomeMessage"
                        id="welcomeMessage"
                        autoComplete="current-welcomeMessage"
                        value={formik.values.welcomeMessage}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.welcomeMessage && Boolean(formik.errors.welcomeMessage)}
                        helperText={formik.touched.welcomeMessage && formik.errors.welcomeMessage}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        multiline
                        name="description"
                        label={t('CreateRoom.description')}
                        type="description"
                        id="description"
                        autoComplete="current-description"
                        value={formik.values.description}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <FileUploader title={t('CreateRoom.cover')} value={formik.values.cover}
                    handleFile={(file) => {formik.setFieldValue('cover', file, false)}}/>
                    <FileUploader title={t('CreateRoom.upload_icon')} handleFile={(file)=>{formik.setFieldValue('icon', file, false)}}/>
                    {/* <TextField
                        required
                        fullWidth
                        name="cover"
                        label="description"
                        type="file"
                        id="description"
                        autoComplete="current-description"
                        value={formik.values.description}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    /> */}
                    </Grid>
                    {/* <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                    </Grid> */}
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    {t('CreateRoom.create')}
                </Button>
            </form>
        </Card>
        {/* <Box mt={5}>
            <Copyright />
        </Box> */}
        </Container>
    );
}

export default CreateRoom;