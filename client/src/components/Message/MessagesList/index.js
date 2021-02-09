import React, { useState, useEffect, useRef, useCallback } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ClientMessage from '../ClientMessage';
import SystemMessage from '../SystemMessage';


const useStyles =  makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'auto',
        maxHeight: '100%',
        flex: '1',
        width: '100%',
        wordBreak: 'break-word',
        scrollbarWidth: 'thin',
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
    loading: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#237edc'
    }
}));


const itemUnit = 50;

const MessagesList = ({ users, messages, role, userAction, roomName, changeMuteState, sendPokeMessage, kickUser, banUser,
    addOrOpenPrivate }) => {
    const messagesRef = useRef();
    const classes = useStyles();

    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [count, setCount] = useState({
        prev: 0,
        next: itemUnit
    });

    const addItems = () => {
        if(currentItems.length === messages.length) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            let newItems = currentItems.concat(messages.slice(count.prev + itemUnit, count.next + itemUnit));
            setCurrentItems(newItems)
            setCount((prevState) => ({ prev: prevState.prev + itemUnit, next: prevState.next + itemUnit }))
            setLoading(false);
        }, 1000);
    }

    const getUserFromList = (username) => {
        // console.log(users)
        let user = users.find((item) => (item.username === username));
        if(user) {
            return user;
        } else {
            return {username};
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if(messagesRef.current.scrollHeight + messagesRef.current.scrollTop - messagesRef.current.clientHeight <= 2) {
                addItems();
            }
        }
        messagesRef.current.addEventListener('scroll', handleScroll)
        return () => messagesRef.current.removeEventListener('scroll', handleScroll)
    }, [currentItems])

    useEffect(() => {
        if(messages.length) {
            setCount({prev: 0, next: itemUnit})
            setCurrentItems(messages.slice(0, count.next));
            setLoading(false);
        }
        
        // if (messagesRef.current) {
        //     messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        // }
        // console.log(messages);
    }, [messages]);

    return (
        <>
        <div ref={messagesRef} className={classes.root}>
            { currentItems &&
                currentItems.map(({ _id, from, msg, date, type, color, bold }, index) => (
                    // <Message key={_id} text={msg} from={from} date={date} />
                    <span key={_id? _id: index}>
                        { type==='public' &&
                        <ClientMessage userAction={userAction}
                            user={getUserFromList(from)}
                            roomName={roomName}
                            role={role}
                            message={{from, msg, date, color, bold}} font_size={10}
                            changeMuteState={changeMuteState}
                            sendPokeMessage={sendPokeMessage}
                            kickUser={kickUser}
                            banUser={banUser}
                            addOrOpenPrivate={addOrOpenPrivate}
                        />
                        }
                        {
                        (type ==='system' || type === 'poke') &&
                            <SystemMessage text={msg} />
                        }
                    </span>
                ))
            }
            { loading &&
                <span className={classes.loading}>Loading ...</span>
            }
        </div>
        {/* <div ref={messagesRef} className={classes.root} id="scrollableDiv"></div>
        <InfiniteScroll
            dataLength={current.length}
            next={getMoreData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
        >
            { current &&
                current.map(({ _id, from, msg, date, type, color, bold }, index) => (
                    // <Message key={_id} text={msg} from={from} date={date} />
                    <span key={_id? _id: index}>
                        { type==='public' &&
                        <ClientMessage userAction={userAction}
                            message={{from, msg, date, color, bold}} font_size={10} />
                        }
                        {
                        (type ==='system' || type === 'poke') &&
                            <SystemMessage text={msg} />
                        }
                    </span>
                ))
            }
        </InfiniteScroll> */}
      </>
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
