import React, { useContext, useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
    CssBaseline,
    Link,
    Grid,
    Typography,
    Container,
    Card,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import LoginSelect from '../../components/LoginSelect';
import {UserContext, SettingContext} from '../../context';
import { handleLogin, handleGuestLogin } from '../../apis';
import OutlinedButton from '../../components/OutlinedButton';
import CustomTextField from '../../components/CustomTextField';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url("/img/login-background.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    error: {
        color: 'red',
    },
    card: {
        // marginTop: theme.spacing(8),
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(4),
        background: theme.palette.primary.main
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
    sigupLink: {
        color: 'white',
    },
    actionField: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: '25px',
        marginBottom: '15px',
        '& button': {
            margin: '5px'
        }
    }
}));

const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);



const Login = () => {
    const { state } = useLocation();
    const { from } = state || { from: { pathname: "/" } };
    const { setAuth } = useContext(UserContext);
    const {maxUsernameLength} = useContext(SettingContext)
    const classes = useStyles();
    const [selected, setSelected] = useState(false);
    const [guest, setGuest] = useState(false);
    const [error, setError] = useState();
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const { t } = useTranslation();
    const loginValidationSchema = yup.object({
        username: yup
        .string('Enter your nickname')
        .required(t('LoginPage.error_username')),
        password: yup
        .string('Enter your password')
        .min(4, 'Password should be of minimum 4 characters length')
        .required(t('LoginPage.error_password')),
        aboutMe: yup
        .string('About me')
        .max(config.aboutMe_length, `It should be of maxium ${config.aboutMe_length} characters length`)
    });
    const guestValidationSchema = yup.object({
        nickname: yup
        .string('Enter your nickname')
        .required(t('LoginPage.error_username'))
        .max(maxUsernameLength, t('LoginPage.error_long_username')),
        aboutMe: yup
        .string('About me')
        .max(config.aboutMe_length, `It should be of maxium ${config.aboutMe_length} characters length`)
    });

    const handleSelectMode = (isGuest) => {
        if(isGuest) {
            setGuest(true)
        } else {
            setGuest(false);
        }
        setSelected(true);
    }

    const loginFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
            aboutMe: ''
        },
        validationSchema: loginValidationSchema,
        onSubmit: (values) => {
            handleLogin(values, () => {setAuth(true);setRedirectToReferrer(true);}, (error) => { setError(t('LoginPage.'+error)) } );
        },
    });

    const guestFormik = useFormik({
        initialValues: {
            nickname: '',
            gender: 'male',
            // aboutMe: ''
        },
        validationSchema: guestValidationSchema,
        onSubmit: (values) => {
            handleGuestLogin(values,() => {setAuth(true);setRedirectToReferrer(true);}, (error) => { setError(t('LoginPage.'+error))} );
        },
    });

    if (redirectToReferrer) {
        return <Redirect to={from} />;
    }
    return (
        <Container component="main" className={classes.root} maxWidth="xs">
            { !selected ?
                <LoginSelect onSelect={handleSelectMode}/>
                :
                <>
                <CssBaseline />
                { !guest ?
                    <Card className={classes.card}>
                        <Typography component="h1" variant="h5">
                        {t('LoginPage.login')}
                        </Typography>
                        <Typography className={classes.error}>{error}</Typography>
                        <form className={classes.form} noValidate onSubmit={loginFormik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <CustomTextField
                                        fullWidth
                                        id="username"
                                        label={t('LoginPage.username')}
                                        name="username"
                                        autoComplete="off"
                                        value={loginFormik.values.email}
                                        onBlur={loginFormik.handleBlur}
                                        onChange={loginFormik.handleChange}
                                        error={loginFormik.touched.username && Boolean(loginFormik.errors.username)}
                                        helperText={loginFormik.touched.username && loginFormik.errors.username}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomTextField
                                        fullWidth
                                        name="password"
                                        label={t('LoginPage.password')}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={loginFormik.values.password}
                                        onBlur={loginFormik.handleBlur}
                                        onChange={loginFormik.handleChange}
                                        error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                                        helperText={loginFormik.touched.password && loginFormik.errors.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomTextField
                                        fullWidth
                                        name="aboutMe"
                                        label={t('LoginPage.about_me')}
                                        id="login-about-me"
                                        autoComplete="off"
                                        value={loginFormik.values.aboutMe}
                                        onBlur={loginFormik.handleBlur}
                                        onChange={loginFormik.handleChange}
                                        error={loginFormik.touched.aboutMe && Boolean(loginFormik.errors.aboutMe)}
                                        helperText={loginFormik.touched.aboutMe && loginFormik.errors.aboutMe}
                                    />
                                </Grid>
                            </Grid>
                            <div className={classes.actionField}>
                                <OutlinedButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    {t('LoginPage.login')}
                                </OutlinedButton>
                                <OutlinedButton
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick = {() => { setSelected(false); setError(null) }}
                                >
                                    {t('LoginPage.back')}
                                </OutlinedButton>
                            </div>
                        </form>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link
                                    className={classes.sigupLink}
                                    component="button"
                                    onClick={() => {
                                        // history.push('/signup');
                                        window.open(config.main_site_url + 'index.php/jomsocial/register')
                                    }}
                                    variant="body2"
                                >
                                    {t('LoginPage.create_new')}
                                </Link>
                                
                            </Grid>
                        </Grid>
                    </Card>
                    :
                    <Card className={classes.card}>
                        <Typography component="h1" variant="h5">
                            {t('LoginPage.guest_join_chat')}
                        </Typography>
                        <Typography className={classes.error}>{error}</Typography>
                        <form className={classes.form} noValidate onSubmit={guestFormik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <CustomTextField
                                        fullWidth
                                        id="nickname"
                                        label={t('LoginPage.username')}
                                        name="nickname"
                                        autoComplete="off"
                                        value={guestFormik.values.nickname}
                                        onBlur={guestFormik.handleBlur}
                                        onChange={guestFormik.handleChange}
                                        error={guestFormik.touched.nickname && Boolean(guestFormik.errors.nickname)}
                                        helperText={guestFormik.touched.nickname && guestFormik.errors.nickname}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={12}>
                                    <CustomTextField
                                        fullWidth
                                        id="guest-about-me"
                                        label={t('LoginPage.about_me')}
                                        name="aboutMe"
                                        autoComplete="off"
                                        value={guestFormik.values.aboutMe}
                                        onBlur={guestFormik.handleBlur}
                                        onChange={guestFormik.handleChange}
                                        error={guestFormik.touched.aboutMe && Boolean(guestFormik.errors.aboutMe)}
                                        helperText={guestFormik.touched.aboutMe && guestFormik.errors.aboutMe}
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <FormControl component="fieldset">
                                    <RadioGroup row aria-label="gender" name="gender" value={guestFormik.values.gender} onChange={guestFormik.handleChange}>
                                        <FormControlLabel value="female" control={<RedRadio />} label={t('LoginPage.female')} />
                                        <FormControlLabel value="male" control={<GreenRadio />} label={t('LoginPage.male')} />
                                    </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <div className={classes.actionField}>
                                <OutlinedButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    {t('LoginPage.login')}
                                </OutlinedButton>
                                <OutlinedButton
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick = {() => { setSelected(false); setError(null); }}
                                >
                                    {t('LoginPage.back')}
                                </OutlinedButton>
                            </div>
                        </form>
                    </Card>
                }
            </>
            }
        </Container>
    );
}

export default Login;