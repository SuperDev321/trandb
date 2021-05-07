import React, { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import StyledMessage from '../Message/StyledMessage'
// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexDirection: (props) => 
//             props.mine
//             ?'row'
//             :'row-reverse',
//     },
//     author: {
//         fontSize: '1rem',
//         fontWeight: '700',
//         whiteSpace: 'nowrap',
//         '&:hover': {
//             cursor: 'pointer',
//             textDecoration: 'underline'
//         }
//     },
//     content: {
//         margin: 5,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: props => 
//             props.mine
//             ? 'flex-start'
//             : 'flex-end'
//     },
//     message: {
//         background: (props) => 
//         props.mine
//         ?theme.palette.primary.main
//         :'lightgrey',
//         color: (props) => 
//         props.mine
//         ?theme.palette.primary.contrastText
//         :'black',
//         padding: 5,
//         borderRadius: 5,
//         borderTopLeftRadius: (props) => 
//         !props.mine && 0,
//         borderTopRightRadius: (props) => 
//         props.mine && 0,
//         maxWidth: '200px'
//     },
//     date: {
//         fontSize: 12
//     }
// }));

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

    useEffect(() => {
        let filteredMessages = messages;
        if(blocked && !withBlocked) {
            filteredMessages = filteredMessages.filter((item) => (item.from !== me.username));
        } else if(!blocked && withBlocked) {
            filteredMessages = filteredMessages.filter((item) => (item.username == me.username));
        } else if(blocked && withBlocked) {
            filteredMessages = [];
        }
        setMessagesToShow(filteredMessages);
    }, [messages, blocked, withBlocked])

    useEffect(() => {
        setScrollTop();
    }, [messagesToShow]);
    const setScrollTop = () => {
        if (listRef.current) {
            console.log('private scroll')
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }
    return (
        <div className={classes.root} ref={listRef}>
            { messagesToShow &&
                messagesToShow.map((message, index) => (
                    <StyledMessage message={message} mine={Boolean(message.from === me.username)} key={index}
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