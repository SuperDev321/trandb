import React, { useContext, useEffect, useState, useRef } from 'react';
import {UserContext} from '../../../context';
import PropTypes, { element } from 'prop-types';
import {EmojiConvertor} from 'emoji-js';
import ImageView from './ImageView';
import moment from 'moment';
import randomstring from "randomstring";
import RoomUserName from '../../RoomUserName';
import useStyles from './styles';
let emoji = new EmojiConvertor();
emoji.img_set = 'apple';
emoji.img_sets.apple.path = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/';
emoji.use_sheet = true;
emoji.init_env();
emoji.supports_css = false;
emoji.allow_native = false;
emoji.replace_mode = 'img';// 'unified';
emoji.use_sheet = true;

const MyMessage = ({user, roomName, message, messageSize, role, font_size, userAction, changeMuteState, sendPokeMessage, 
    kickUser, banUser, addOrOpenPrivate, scrollEvent, ...props}) => {
    const classes = useStyles({color: message.color, bold: message.bold, messageSize});
    const { username } = useContext(UserContext);
    const [checked, setChecked] = useState(false);

    

    const urlify = (text) => {
    
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        let arr = text.split(urlRegex);
        let noRepeatArr = [...new Set(arr)];
        for (let index = 0; index < noRepeatArr.length; index++) {
        const element = noRepeatArr[index];
        
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(element)) {
            text = text.replace(element, `<a href="${element}" target="_blank">${element}</a>`);
        } else {
            text = text.replace(element, `<span>${element}</span>`);
        }
        }
        return text;
        // or alternatively
        // return text.replace(urlRegex, '<a href="$1">$1</a>')
    }
    const makeTag = (emojiText) => {
        let arr = emojiText.split(/<img .*?>/g);
        let noRepeatArr = [...new Set(arr)];
        let urlText = emojiText;
        if(noRepeatArr && noRepeatArr.length) {
        for (let index = 0; index < noRepeatArr.length; index++) {
            const element = noRepeatArr[index];
            if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(element)) {
                urlText = urlText.replace(element, urlify(element));
            }
            else {
                // urlText = urlText.replace(element, `<span>${element}</span>`);
            }
        }
        }
        return urlText
    }

    const emojiConverter = (text) => {
        let emojiText =  emoji.replace_unified(text);
        return emojiText;
    }

    const handleClick = (e) => {
        if(e && e.target && e.target.tagName) {
            if(e.target.tagName === 'A') {
                e.preventDefault();
                let url = e.target.href
                let host = e.target.host
                userAction('show_link', {url, host});
            }
        }
    }

    return (
        <div className={classes.message} {...props}>
            <div className={classes.messageContent}>
            <span className={classes.sender}>
                <RoomUserName
                user={user}
                roomName={roomName}
                isMine={username === user.username}
                displayYou={false}
                changeMuteState={changeMuteState}
                sendPokeMessage={sendPokeMessage}
                kickUser={kickUser}
                banUser={banUser}
                addOrOpenPrivate={addOrOpenPrivate}
                role={role}
                isBlocked={false}
                />
                <span>:&nbsp;</span></span>
                <>
                { (message.messageType === 'image') ?
                    <ImageView url={message.msg} className={classes.text + ' ' + classes.size10} scrollEvent={scrollEvent} />
                    /* <span className={classes.text + ' ' + classes.size10}>
                {!checked ? <a href="#!" style={{color: '#046eb9'}}>
                <strong
                    onClick={() => {setChecked(true)}}
                    style={{cursor: "pointer"}}>click to view</strong></a> :
                <img src={'/'+message.msg} className={classes.photo}/>}
                </span> */
                :
                <span
                    className={classes.text}
                    onClick={handleClick}
                    dangerouslySetInnerHTML={{__html: makeTag(emojiConverter(message.msg))}}
                >
                {/* {
                    convertHTML(makeTag(emojiConverter(message.msg)))
                } */}
                </span>
                }
                </>
            </div>
            <span className={classes.time}>{moment(message.date).format('HH:mm')}</span>
        </div>
    );
}

// MyMessage.propTypes = {
//   message: PropTypes.shape({
//     sender: PropTypes.shape.isRequired,
//     msg: PropTypes.string.isRequired,
//     // message_type: PropTypes.string.isRequired,
//     // color: PropTypes.string.isRequired,
//     date: PropTypes.string.isRequired,
//   }).isRequired,
// //   onActionOnMessage: PropTypes.func.isRequired,
//   font_size: PropTypes.number.isRequired,
// };

export default React.memo(MyMessage);
