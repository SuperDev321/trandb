import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ClientMessage from '../ClientMessage';
import JoinLeaveMessage from '../JoinLeaveMessage';
import SystemMessage from '../SystemMessage';
import BootMessage from '../BootMessage';
import {CustomThemeContext} from '../../../themes/cutomThemeProvider';
import { SettingContext } from '../../../context';
import GiftMessage from '../GiftMessage';

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

const MessagesList = ({ users, messages, role, userAction, roomName}) => {
    const messagesRef = useRef();
    const classes = useStyles();
    const {messageSize} = useContext(SettingContext);

    const setScrollTop = () => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }

    const getUserFromList = (username) => {
        let user = users.find((item) => (item.username === username));
        if(user) {
            return user;
        } else {
            return {username};
        }
    }

    const scrollEvent = (index) => {
        setScrollTop();
    }

    useLayoutEffect(() => {
        setScrollTop();
    }, [messages])

    return (
        <>
        <div ref={messagesRef} className={classes.root}>
            { messages?.map(({ _id, from, msg, date, type, color, bold, messageType, size, giftImage }, index) => (
                    // <Message key={_id} text={msg} from={from} date={date} />
                    <span key={_id? _id: index}>
                        { (type==='public' && (messageType === 'general' || messageType === 'image'))  &&
                            <ClientMessage
                                id={`message-${_id}`}
                                userAction={userAction}
                                user={getUserFromList(from)}
                                roomName={roomName}
                                role={role}
                                message={{_id, from, msg, date, color, bold, messageType}} font_size={10}
                                messageSize={messageSize}
                                scrollEvent={() => {scrollEvent(index)}}
                            />
                        }
                        {
                        (type ==='public' && messageType === 'boot') &&
                            <BootMessage message={{msg, color, bold, size}}  />
                        }
                        {
                        (type ==='system' || type === 'poke') &&
                            <SystemMessage text={msg} />
                        }
                        {
                        (type ==='joinLeave') &&
                            <JoinLeaveMessage text={msg} />
                        }
                        {
                        (type ==='gift') &&
                            <GiftMessage text={msg} image={giftImage}/>
                        }
                    </span>
                ))
            }
            {/* { loading &&
                <span className={classes.loading}>Loading ...</span>
            } */}
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
