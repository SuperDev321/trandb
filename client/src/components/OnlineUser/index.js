import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Paper,
    Popover,
    Card,
    CardActionArea,
    CardMedia,
    CardActions,
    CardContent,
    Typography,
    Button,
    Divider,
    Badge,
} from '@material-ui/core';
import { deepOrange, pink, blue } from '@material-ui/core/colors';
import {QuestionAnswer, AccountCircleOutlined, Videocam, Block, Check} from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
    listItem: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '2px 15px 2px 15px',
        width: '100%',
    },
    username: {
        font: 'bold 14px sans-serif',
        cursor: 'pointer',
        flexGrow: 1
    },
    role: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        fontSize: 15,
        marginRight: theme.spacing(0.5),
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: (props) => {
            if(props.role === 'guest') {
                return deepOrange[500];
            } else {
                return blue[500];
            }
        }
        
    },
    avatar: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        
        minWidth: 0
    },
    camera: {
        color: '#e6e6e6',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 140,
        width: 200,
        backgroundImage: '/img/public_chat.png',
    },
    cardButton: {
        borderRadius: '0',
        height: 40,
        textTransform: 'none',
    },
    mute: {
        color: pink[500],
        textTransform: 'none',
    }
}))

const StyledBadge = withStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing(0.5),
    },
    badge: {
        padding: 0,
        color: pink[500],
        transform: 'none'
    }
}))((props) => (
    <Badge
        {...props}
    />
))

const OnlineUser = ({roomName, username, user, changeMuteState, unRead, setOpenPrivate, setPrivateTo}) => {
    const classes = useStyles({role: user.role});
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        
    };

    const handleClickPrivateChat = (event) => {
        event.preventDefault();
        setPrivateTo(user);
        setOpenPrivate(true);
        setAnchorEl(null);
    }
    const handleMute = (username) => {
        changeMuteState(roomName, username);
        setAnchorEl(null);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <div>
            {/* <StyledBadge badgeContent={unRead && unRead} color="secondary"> */}
                <div className={classes.listItem}
                >
                    <Avatar className={classes.role}>{
                        user.role === 'guest' ? 'G':
                        <Check fontSize="small" />
                    }</Avatar>
                    <StyledBadge
                        className={classes.avatarBadge}
                        badgeContent={user.muted && <Block fontSize="small" />}
                    >
                        <Avatar alt="Remy Sharp" src={
                                user.gender === 'male' ? '/img/male.png': '/img/female.png'
                            } 
                            className={classes.avatar}
                        />
                    </StyledBadge>
                    <Videocam className={classes.camera} />
                    <div className={classes.username} onClick={handleClick}>{user.username}</div>
                </div>
            {/* </StyledBadge> */}
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <Card className={classes.root}>
                    <CardMedia
                        className={classes.cardHeader}
                        // image="/img/public_chat.png"
                    >
                        <Avatar alt="User Avatar" src={
                            '/img/default_avatar.png'
                        } />
                        <span>{user.gender}</span>
                    </CardMedia>
                    <Divider />
                    <Button size="small" color="primary" fullWidth className={classes.cardButton}>
                    <AccountCircleOutlined />&nbsp;Profile
                    </Button>
                    { user.username != username &&
                        <>
                        <Divider />
                        <Button size="small"
                            color="primary"
                            fullWidth
                            className={classes.cardButton}
                            onClick={ handleClickPrivateChat}
                        >
                        <QuestionAnswer />&nbsp;Private Chat
                        </Button>
                        </>
                    }
                    <Button className={classes.mute}
                        fullWidth onClick={() => { handleMute(user.username) }}
                        name={user.username}
                    >
                    {
                        user.muted
                        ? 'Silence / Ignorance'
                        : 'Unmute / Ignore'
                    }
                    </Button>
                </Card>
            </Popover>
        </div>
    );
}

export default OnlineUser;