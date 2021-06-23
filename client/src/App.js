import React from 'react';
import { Switch } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {UserContext, SettingContext} from './context';
import CustomThemeProvider from './themes/cutomThemeProvider'
import { useAuth, useSetting } from './utils';
import { Signup, Login, Rooms, ChattingRoom, RoomSetting, Profile, EditProfile, Loading } from './pages';
import { PublicRoute, PrivateRoute } from './components';
import CreateRoom from './pages/CreateRoom';
import { SnackbarProvider } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import './App.css';

const useStyles = makeStyles((theme) =>({
    app: {
        fontFamily: 'sans-serif',
    }
}));


const App = () => {
    const classes = useStyles();
    const { loading, auth, role, setAuth, setLoading, username, removeCurrentUser,
        avatar, gender, updateUser, myUser, point } = useAuth();
    const { defaultTheme, messageSize, enablePokeSound, enablePrivateSound, enablePublicSound,
        setDefaultTheme, setMessageSize, setEnablePokeSound, setEnablePrivateSound, setEnablePublicSound,
        language, setLanguage, messageNum, enableSysMessage, setEnableSysMessage,
        messageTimeInterval, maxUsernameLength, maxMessageLength, privateMutes, addPrivateMute, removePrivateMute,
        avatarOption, avatarColor, allowGuestAvatarUpload
    } = useSetting();
    if (loading) {
        return <Loading />;
    }
    const notistackRef = React.createRef();
    const onClickDismiss = key => () => { 
        notistackRef.current.closeSnackbar(key);
    }

    return (
        <SnackbarProvider
            maxSnack={5}
            ref={notistackRef}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            action={(key) => (
                <CloseIcon onClick={onClickDismiss(key)} />
            )}
        >
        <SettingContext.Provider
            value={{ defaultTheme, messageSize, enablePokeSound,
                enablePrivateSound, enablePublicSound,
                setDefaultTheme,setMessageSize, setEnablePokeSound,
                setEnablePrivateSound, setEnablePublicSound,
                language, setLanguage, messageNum, enableSysMessage, setEnableSysMessage,
                messageTimeInterval, maxUsernameLength, maxMessageLength, privateMutes, addPrivateMute, removePrivateMute,
                avatarOption, avatarColor, allowGuestAvatarUpload
            }}
        >
        <CustomThemeProvider defaultTheme={defaultTheme}>
            <UserContext.Provider
                value={{ auth, role, gender, avatar, loading, setAuth, setLoading, username,
                removeCurrentUser, updateUser, myUser, point }}
            >
            <div className={classes.app} id='app' dir="rtl">
                <Switch>
                    <PublicRoute exact path="/">
                        <Rooms />
                    </PublicRoute>
                    <PublicRoute path="/setting/room/:room">
                        <RoomSetting />
                    </PublicRoute>
                    {/* <PublicRoute path="/profile/:username/edit">
                        <EditProfile />
                    </PublicRoute> */}
                    <PublicRoute path="/profile/:username">
                        <Profile />
                    </PublicRoute>
                    <PublicRoute path="/signup">
                        <Signup />
                    </PublicRoute>
                    <PublicRoute path="/login">
                        <Login />
                    </PublicRoute>
                    <PrivateRoute path="/rooms/:room">
                            <ChattingRoom/>
                    </PrivateRoute>
                    <PrivateRoute path="/room/create">
                        <CreateRoom />
                    </PrivateRoute>
                    <PrivateRoute path="/rooms">
                        <Rooms />
                    </PrivateRoute>
                </Switch>
            </div>
            </UserContext.Provider>
        </CustomThemeProvider>
        </SettingContext.Provider>
        </SnackbarProvider>
        
    );
};

export default App;
