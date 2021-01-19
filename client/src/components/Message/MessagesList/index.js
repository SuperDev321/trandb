import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

// import Message from '../../OldMessage';
import ClientMessage from '../ClientMessage';
import SystemMessage from '../SystemMessage';

const useStyles =  makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: '100%',
        flex: '1',
        width: '100%',
        wordBreak: 'break-word',
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
}));


const MessagesList = ({ messages, userAction }) => {
    const messagesRef = useRef();
    const classes = useStyles();

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
        // console.log(messages);
    }, [messages]);

    return (
        <div ref={messagesRef} className={classes.root}>
            { messages &&
                messages.map(({ _id, from, msg, date, type, color, bold }, index) => (
                    // <Message key={_id} text={msg} from={from} date={date} />
                    <span key={index}>
                        { type==='public' &&
                        <ClientMessage key={_id? _id: index} userAction={userAction}
                            message={{from, msg, date, color, bold}} font_size={10} />
                        }
                        {
                        (type ==='system' || type === 'poke') &&
                            <SystemMessage text={msg} />
                        }
                    </span>
                ))
            }
        </div>
    );
};

MessagesList.propTypes = {
  messages: propTypes.arrayOf(
    propTypes.shape({
        type: propTypes.string.isRequired,
        msg: propTypes.string.isRequired,
    })
  ),
};

export default React.memo(MessagesList);
