import React, { useCallback, useContext, useState } from 'react';
import {SettingContext, UserContext} from '../../../context';
import {EmojiConvertor} from 'emoji-js';
import parseHTML from 'parsehtml';
import ImageView from './ImageView';
import moment from 'moment';
import RoomUserName from '../../RoomUserName';
import useStyles from './styles';
import emojis from '../../../utils/objects/emoji';
import config from '../../../config';

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

function getValidCustomEmoji(value) {
    return emojis.find(({ name }) => (name === value));
}

const MyMessage = ({id, user, roomName, message, messageSize, role, font_size, userAction,
    scrollEvent, ...props}) => {
    const classes = useStyles({color: message.color, bold: message.bold, messageSize});
    const { username } = useContext(UserContext);
    const { emojiOption, showEmoji } = useContext(SettingContext);

    const makeTag = useCallback((text) => {
        let arr = emojiStringToArray(text);
        let noRepeatArr = [...new Set(arr)];
        let htmlObj = [];
        if (noRepeatArr && noRepeatArr.length) {
            for (let index = 0; index < noRepeatArr.length; index++) {
                const element = noRepeatArr[index];
                const key = `${id}-${index}`;
                if(isValidHttpUrl(element)) {
                    // urlText = urlText.replace(element, urlify(element));
                    htmlObj.push(<a href={element} target="_blank" key={key} rel='noopener'>{element}</a>)
                } else if(new RegExp(/([\uD800-\uDBFF][\uDC00-\uDFFF])/).test(element)) {
                    const emojiText = emoji.replace_unified(element);
                    htmlObj.push(<div key={key} dangerouslySetInnerHTML={{ __html: emojiText }}></div>)
                } else {
                    // urlText = urlText.replace(element, `<span>${element}</span>`);
                    htmlObj.push(<span key={key}>{element}</span>)
                }
            }
        }
        return htmlObj
    }, [id]);

    const makeTagWithCustom = useCallback((text) => {
        const arr = text.split(/(['>','<'])/)
        let tmp = '';
        const newArr = [];
        arr.forEach((item) => {
            if (item === '>') {
                if (tmp !== '') {
                    newArr.push(tmp);
                }
                tmp = '>';
            } else if (item === '<') {
                tmp += '<';
                newArr.push(tmp);
                tmp = ''
            } else {
                tmp += item;
            }
        })
        if (tmp !== '') {
            if (tmp !== '') {
                newArr.push(tmp);
            }
        }
        if (newArr[0] === '') {
            newArr.slice(0, 1)
        }
        let htmlObj = [];
        if (newArr && newArr.length) {
            for (let index = 0; index < newArr.length; index++) {
                const element = newArr[index];
                const key = `${id}-${index}`;
                if(isValidHttpUrl(element)) {
                    // urlText = urlText.replace(element, urlify(element));
                    htmlObj.push(<a href={element} key={key} target="_blank" rel="noopener noreferrer">{element}</a>)
                } else if(showEmoji && element.charAt(0) === '>' && element.charAt(element.length - 1) === '<') {
                    const name = element.slice(1, element.length - 1);
                    const emoji = getValidCustomEmoji(name);
                    if (emoji) {
                        htmlObj.push(<img key={key} src={`${config.emoji_path}/${emoji.path}`} className="custom-emoji"/>)
                    } else {
                        htmlObj.push(<span key={key}>{element}</span>)
                    }
                } else {
                    // urlText = urlText.replace(element, `<span>${element}</span>`);
                    htmlObj.push(<span key={key}>{element}</span>)
                }
            }
        }
        return htmlObj
    }, [id])

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
                    { emojiOption ?
                        makeTag(message.msg)
                        :
                        makeTagWithCustom(message.msg)
                    }
                </span>
                }
                </>
            </div>
            <span className={classes.time}>{moment(message.date).format('HH:mm')}</span>
        </div>
    );
}

export default React.memo(MyMessage);
