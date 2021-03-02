import React, { useContext, useEffect, useState } from 'react';
import {UserContext} from '../../../context';
import PropTypes, { element } from 'prop-types';
import {EmojiConvertor} from 'emoji-js';
import parseHTML from 'parsehtml';
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

const MyMessage = ({user, roomName, message, defaultColor, role, font_size, userAction, changeMuteState, sendPokeMessage, 
  kickUser, banUser, addOrOpenPrivate}) => {
  const classes = useStyles({color: message.color, bold: message.bold});
  const { username } = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const urlify = (text) => {
    
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let arr = text.split(urlRegex);
    let noRepeatArr = [...new Set(arr)];
    for (let index = 0; index < noRepeatArr.length; index++) {
      const element = noRepeatArr[index];
      
      if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(element)) {
        text = text.replace(element, `<a href="${element}" target="_blank"></a>`);
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
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let noRepeatArr = [...new Set(arr)];
    let urlText = emojiText;
    if(noRepeatArr && noRepeatArr.length) {
      for (let index = 0; index < noRepeatArr.length; index++) {
        const element = noRepeatArr[index];
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(element)) {
          urlText = urlText.replace(element, urlify(element));
        }
        else {
          urlText = urlText.replace(element, `<span>${element}</span>`);
        }
      }
    }
    return urlText
  }

  const emojiConverter = (text) => {
    let emojiText =  emoji.replace_unified(text);
    return emojiText;
    
  }

  const convertHTML = (text) => {
    //   console.log('convertHTML',text)
    // console.log(text) 
    text = text.split('\" />').join('\">');
    let result = [];
    var html = parseHTML(text);
    // console.log(text)

    if (html.children.length > 0) {
      for (let k = 0; k < html.children.length; k++) {
        const element = html.children[k];
        let key = randomstring.generate(8);
        if (element.tagName == "IMG") {
          key = randomstring.generate(8)
          result.push(<img key={key} src={element.attributes[0].nodeValue}
                           className={element.attributes[1].nodeValue}
                           data-codepoints={element.attributes[2].nodeValue}/>)
        } else if (element.tagName === "A") {
          let url = element.href
          let host = element.host
          result.push(<span key={key} className={classes.url_underline}
                            onClick={() => userAction('show_link', {url, host})}>{url}</span>)
        } else{
          element.setAttribute('key', key);
          result.push(<span key={key}>{element.innerHTML}</span>)
        }
      }
    } else {
        let key = randomstring.generate(8);
        if (html.tagName == "IMG") {
          result.push(<img key={key} src={html.attributes[0].nodeValue}
                           className={html.attributes[1].nodeValue}
                           data-codepoints={html.attributes[2].nodeValue}/>)
        } else if (html.tagName === "A") {
          let url = html.href
          result.push(<span key={key} className={classes.url_underline}
                            onClick={() =>{userAction('show_link', {url})} }>{url}</span>)
        } else{
          result.push(<span key={key}>{html.innerHTML}</span>)
        }
    }
    return result
  }
    return (
      <div className={classes.message}>
        <div className={classes.messageContent}>
          <span className={classes.sender}><RoomUserName
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
          />
            <span>:&nbsp;</span></span>
            <>
            { (message.messageType === 'image') ?
            <span className={classes.text + ' ' + classes.size10}>
            {!checked ? <a href="#!" style={{color: '#046eb9'}}>
              <strong
                onClick={() => {setChecked(true)}}
                style={{cursor: "pointer"}}>click to view</strong></a> :
              <img src={'/'+message.msg} className={classes.photo}/>}
            </span>
            :
            <span
            className={classes.text + ' ' + classes.size10}
            // dangerouslySetInnerHTML={{__html: makeTag(emojiConverter(message.msg))}}
            >
              {
                convertHTML(makeTag(emojiConverter(message.msg)))
              }
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

export default MyMessage;
