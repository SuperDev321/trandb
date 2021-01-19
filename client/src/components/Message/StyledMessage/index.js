import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import {EmojiConvertor} from 'emoji-js';
import {grey, blue} from '@material-ui/core/colors'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: (props) => 
            props.mine
            ?'row'
            :'row-reverse',
    },
    author: {
        fontSize: '1rem',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    content: {
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: props => 
            props.mine
            ? 'flex-start'
            : 'flex-end'
    },
    message: {
        background: grey[100],
        color: (props) => 
        props.color
        ?props.color
        :theme.palette.getContrastText(grey[100]),
        fontWeight: (props) =>
        props.bold
        ? 'bold'
        : 200,
        padding: 5,
        borderRadius: 5,
        borderTopLeftRadius: (props) => 
        !props.mine && 0,
        borderTopRightRadius: (props) => 
        props.mine && 0,
        maxWidth: '200px',
        '& img': {
            width: 20,
            height: 20,
            verticalAlign: 'bottom'
        },
        boxShadow: '0 0 6px 1px #00000052',
    },
    date: {
        fontSize: 12
    }
}));

let emoji = new EmojiConvertor();
emoji.img_set = 'apple';
emoji.img_sets.apple.path = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/';
emoji.use_sheet = true;
emoji.init_env();
emoji.supports_css = false;
emoji.allow_native = false;
emoji.replace_mode = 'img';// 'unified';
emoji.use_sheet = true;

const StyledMessage = ({message, mine}) => {
    const classes = useStyles({mine, color: message.color, bold: message.bold});
    const emojiConverter = (text) => {
        return emoji.replace_unified(text);
    }
    return (
        <div className={classes.root}>
            { !mine &&
                <span className={classes.author}>{message.from}</span>
            }
            
            <div className={classes.content}>
                <div  className={classes.message}  dangerouslySetInnerHTML={{__html: emojiConverter(message.msg)}}>
                </div>
                <div className={classes.date}>{moment(message.date).format('hh:mm')}</div>
            </div>
        </div>
    )
}

export default StyledMessage;