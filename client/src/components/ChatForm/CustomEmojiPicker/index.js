import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import config from '../../../config';
import emojis from '../../../utils/objects/emoji';

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#fff',
        display: 'flex',
        // flexDirection: 'column',
        height: 320,
        width: 260,
        fontFamily: 'sans-serif',
        border: '1px solid #efefef',
        borderRadius: 5,
        boxSizing: 'border-box',
        boxShadow: '0 5px 10px #efefef',
        overflow: 'hidden',
        position: 'relative',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: `#585B5E #ecdbdb00`,
        WebkitOverflowScrolling: 'touch', 
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&:hover::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(0 0 0 / 25%)',
            outline: 'none',
            borderRadius: '5px',
        }
    },
    emojiImg: {
        padding: 5,
        borderRadius: 5,
        margin: 5,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(198, 207, 255)'
        }
    }
}))
const CustomEmojiPicker = ({onEmojiClick}) => {
    const classes = useStyles();

    const handleClickEmoji = (emoji) => {
        onEmojiClick(emoji);
    }
    return (
        <div className={classes.root}>
        {
            emojis?.map((emoji) => (
                <img src={`${config.emoji_path}${emoji.path}`} className={classes.emojiImg} width="40" height="40"
                    onClick={() => handleClickEmoji(emoji)}                    
                />
            ))
        }
        </div>
    )
}

export default CustomEmojiPicker;