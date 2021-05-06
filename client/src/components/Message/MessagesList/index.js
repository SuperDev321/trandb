import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useContext } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ClientMessage from '../ClientMessage';
import SystemMessage from '../SystemMessage';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
import { SettingContext } from '../../../context';
import { message } from 'antd';

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
        scrollbarColor: `#585B5E #ecdbdb00`,
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
    const {currentTheme} = useContext(CustomThemeContext);
    const {messageNum, messageSize} = useContext(SettingContext);
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [count, setCount] = useState({
        prev: 0,
        next: itemUnit
    });
    const setScrollTop = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }
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
    const defaultColor = currentTheme === 'normal'? '#000': '#fff';

    useEffect(() => {
        if(messages.length) {
            if(messages.length > messageNum) {
                setCurrentItems(messages.slice(0, messageNum));
            } else {
                setCurrentItems(messages)
            }
            setLoading(false);
        }
        
        
    }, [messages]);

    useLayoutEffect(() => {
        setScrollTop();
    })

    return (
        <>
        <div ref={messagesRef} className={classes.root}>
            { currentItems &&
                currentItems.map(({ _id, from, msg, date, type, color, bold, messageType }, index) => (
                    // <Message key={_id} text={msg} from={from} date={date} />
                    <span key={_id? _id: index}>
                        { type==='public' &&
                        <ClientMessage userAction={userAction}
                            user={getUserFromList(from)}
                            roomName={roomName}
                            role={role}
                            message={{_id, from, msg, date, color, bold, messageType}} font_size={10}
                            messageSize={messageSize}
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
