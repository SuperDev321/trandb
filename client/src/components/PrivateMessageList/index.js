import React, { useState, useEffect, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import StyledMessage from '../Message/StyledMessage'

const useListStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'auto',
        maxHeight: '100%',
        flex: '1',
        width: '100%',
        padding: 5,
        wordBreak: 'break-word',
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
    }
}))


const PrivateMessageList = ({messages, me, blocked, withBlocked}) => {
    const classes = useListStyles();
    const listRef = useRef();
    const [messagesToShow, setMessagesToShow] = useState([]);

    const setScrollTop = useCallback(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [listRef]);

    useEffect(() => {
        let filteredMessages = messages;
        if(blocked && !withBlocked) {
            filteredMessages = filteredMessages.filter((item) => (item.from !== me.username));
        } else if(!blocked && withBlocked) {
            filteredMessages = filteredMessages.filter((item) => (item.username === me.username));
        } else if(blocked && withBlocked) {
            filteredMessages = [];
        }
        setMessagesToShow(filteredMessages);
    }, [messages, blocked, withBlocked, me])

    useEffect(() => {
        setScrollTop();
    }, [messagesToShow, setScrollTop]);

    
    return (
        <div className={classes.root} ref={listRef}>
            { messagesToShow &&
                messagesToShow.map((message, index) => (
                    <StyledMessage
                        message={message}
                        mine={Boolean(message.from === me.username)}
                        key={message._id?message._id: index}
                    />
                ))
            }
        </div>
    )
}

StyledMessage.propTypes = {
    mine: propTypes.oneOf([true, false]).isRequired,
}

export default PrivateMessageList;
