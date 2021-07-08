import React, { useContext, useState } from 'react';
import {UserContext} from '../../../context';
import {EmojiConvertor} from 'emoji-js';
import parseHTML from 'parsehtml';
import ImageView from './ImageView';
import moment from 'moment';
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

var emojiStringToArray = function (str) {
    let split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    const arr = [];
    for (var i=0; i<split.length; i++) {
      let char = split[i]
      if (char !== "") {
        arr.push(char);
      }
    }
    return arr;
};

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}

const MyMessage = ({user, roomName, message, messageSize, role, font_size, userAction, changeMuteState, sendPokeMessage, 
    kickUser, banUser, addOrOpenPrivate, scrollEvent, ...props}) => {
    const classes = useStyles({color: message.color, bold: message.bold, messageSize});
    const { username } = useContext(UserContext);

    const urlify = (text) => {
    
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        let arr = text.split(urlRegex);
        let noRepeatArr = [...new Set(arr)];
        for (let index = 0; index < noRepeatArr.length; index++) {
            const element = noRepeatArr[index];
            
            if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(element)) {
                
                text = text.replace(element, <a href="${element}" target="_blank">${element}</a>);
            } else {
                text = text.replace(element, <span>${element}</span>);
            }
        }
        return text;
        // or alternatively
        // return text.replace(urlRegex, '<a href="$1">$1</a>')
    }
    const makeTag = (text) => {
        let arr = emojiStringToArray(text);
        let noRepeatArr = [...new Set(arr)];
        let htmlObj = [];
        if (noRepeatArr && noRepeatArr.length) {
            for (let index = 0; index < noRepeatArr.length; index++) {
                const element = noRepeatArr[index];
                if(isValidHttpUrl(element)) {
                    // urlText = urlText.replace(element, urlify(element));
                    console.log(element)
                    htmlObj.push(<a href={element} target="_blank">{element}</a>)
                } else if(new RegExp(/([\uD800-\uDBFF][\uDC00-\uDFFF])/).test(element)) {
                    const emojiText = emoji.replace_unified(element);
                    htmlObj.push(<div dangerouslySetInnerHTML={{ __html: emojiText }}></div>)
                } else {
                    // urlText = urlText.replace(element, `<span>${element}</span>`);
                    htmlObj.push(<span>{element}</span>)
                }
            }
        }
        return htmlObj
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
                showAboutMe={false}
                />
                <span>:&nbsp;</span></span>
                <>
                { (message.messageType === 'image') ?
                    <ImageView url={message.msg} className={classes.text + ' ' + classes.size10} scrollEvent={scrollEvent} />
                :
                <span
                    className={classes.text}
                    onClick={handleClick}
                >
                    {makeTag(message.msg)}
                </span>
                }
                </>
            </div>
            <span className={classes.time}>{moment(message.date).format('HH:mm')}</span>
        </div>
    );
}

export default React.memo(MyMessage);
