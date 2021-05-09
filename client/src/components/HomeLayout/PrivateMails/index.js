import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    IconButton,
    Badge,
} from "@material-ui/core";
import {
    Mail,
    Settings,
    AccountCircle
} from '@material-ui/icons'
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { pink } from '@material-ui/core/colors';
import AvatarAndName from '../../AvatarAndName';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    unRead: {
        background: pink[500],
        color: theme.palette.getContrastText(pink[500]),
        borderRadius: '50%',
        width: 20,
        height: 20,
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1
    },
    dialog: {
        minWidth: 300
    }
}))

const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
};

const PrivateMails = ({openPrivate, unReadMsgs}) => {
    const [open, setOpen] = React.useState(false);
    const [privates, setPrivates] = React.useState([]);
    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();

    useEffect(() => {
          let messagesGroupByFrom = groupBy(unReadMsgs, 'from');
          console.log('private app', messagesGroupByFrom);
          let chats = Object.keys(messagesGroupByFrom).map((key) => ({from: key, num: messagesGroupByFrom[key].length}));
          setPrivates(chats);
          console.log(chats)
    }, [unReadMsgs]);
    
    const handleListItemClick = (item) => {
        handleClose();
        setTimeout(() => {
            openPrivate({username: item.from});
        }, 0)
    };
    return (
        <>
        <IconButton aria-label="show 4 new mails" color="inherit" onClick={() => {setOpen(true)}}>
            <Badge badgeContent={unReadMsgs.length} color="secondary">
                <Mail />
            </Badge>
        </IconButton>
        <Dialog onClose={handleClose}
            maxWidth="xs"
            fullWidth
            aria-labelledby="privatemail-dialog-title" open={open} className={classes.dialog}>
            <DialogTitle id="privatemail-dialog-title">Recent messages</DialogTitle>
            <List>
                { privates.map((item) => (
                <ListItem button onClick={() => handleListItemClick(item)} key={item.from}>
                    <AvatarAndName username={item.from} />
                    <span className={classes.grow}/>
                    <span className={classes.unRead} >{item.num > 9 ? '9+': item.num}</span>
                </ListItem>
                ))}
            </List>
        </Dialog>
        </>
    )
}

export default PrivateMails;