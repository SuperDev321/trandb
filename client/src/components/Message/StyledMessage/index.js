import React, { useState, useContext } from 'react';
import { SettingContext } from '../../../context';
import { makeStyles } from '@material-ui/core/styles';
import {EmojiConvertor} from 'emoji-js';
import moment from 'moment';
import {grey} from '@material-ui/core/colors';
import emojis from '../../../utils/objects/emoji';
import config from '../../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: (props) => 
            props.mine
            ?'row'
            :'row-reverse',
    },
    author: {
        fontSize: '1rem',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    content: {
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: props => 
            props.mine
            ? 'flex-start'
            : 'flex-end'
    },
    message: {
        background: '#17171829',
        color: props => {
            if (props.color && theme.palette.messageColors[props.color]) {
                return theme.palette.messageColors[props.color]
            } else if (theme.palette.messageColors.default) {
                return theme.palette.messageColors.default
            } else {
                return '#fff'
            }
        },
        fontSize: '0.9rem',
        fontWeight: (props) =>
        props.bold
        ? 'bold'
        : 200,
        padding: 5,
        borderRadius: 5,
        borderTopLeftRadius: (props) => 
        !props.mine && 0,
        borderTopRightRadius: (props) => 
        props.mine && 0,
        maxWidth: '200px',
        '& img': {
            width: 20,
            height: 20,
            verticalAlign: 'bottom'
        },
        boxShadow: '0 0 0px 1px #a0a0a0b5',
    },
    date: {
        fontSize: 12,
        color: (props) => 
        props.color
        ?(props.color === 'default'? theme.palette.textColor.main: props.color)
        :theme.palette.getContrastText(grey[100]),
    },
    photo: {
        maxWidth: '250px !important',
        width: 'auto !important',
        height: 'auto !important'
    },
    url_underline: {
        cursor: 'pointer',
        color : '#007bff',
        '&:hover': {
            color : '#0056b3',
            textDecoration: 'underline',
        }
    },
}));

let emoji = new EmojiConvertor();
emoji.img_set = 'apple';
emoji.img_sets.apple.path = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/';
emoji.use_sheet = true;
emoji.init_env();
emoji.supports_css = false;
emoji.allow_native = false;
emoji.replace_mode = 'img';// 'unified';
emoji.use_sheet = true;
const emojiStringToArray = (str) => {
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
const isValidHttpUrl = (string) => {
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

const StyledMessage = ({message, mine}) => {
    const [checked, setChecked] = useState(false);
    const classes = useStyles({mine, color: message.color, bold: message.bold});
    const { emojiOption } = useContext(SettingContext);

    const emojiConverter = (text) => {
        let emojiText =  emoji.replace_unified(text);
        return emojiText;
    }
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
    const makeTag = (text) => {
        let arr = emojiStringToArray(text);
        let noRepeatArr = [...new Set(arr)];
        let htmlObj = [];
        if (noRepeatArr && noRepeatArr.length) {
            for (let index = 0; index < noRepeatArr.length; index++) {
                const element = noRepeatArr[index];
                if(isValidHttpUrl(element)) {
                    // urlText = urlText.replace(element, urlify(element));
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
    const makeTagWithCustom = (text) => {
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
                if(isValidHttpUrl(element)) {
                    // urlText = urlText.replace(element, urlify(element));
                    htmlObj.push(<a href={element} target="_blank">{element}</a>)
                } else if(element.charAt(0) === '>' && element.charAt(element.length - 1) === '<') {
                    const name = element.slice(1, element.length - 1);
                    const emoji = getValidCustomEmoji(name);
                    if (emoji) {
                        htmlObj.push(<img src={`${config.emoji_path}/${emoji.path}`}/>)
                    } else {
                        htmlObj.push(<span>{element}</span>)
                    }
                } else {
                    // urlText = urlText.replace(element, `<span>${element}</span>`);
                    htmlObj.push(<span>{element}</span>)
                }
            }
        }
        return htmlObj
    }

    return (
        <div className={classes.root}>
            { !mine &&
                <span className={classes.author}>{message.from}</span>
            }
            
            <div className={classes.content}>
            <>
            { (message.messageType === 'image') ?
            <span className={classes.text + ' ' + classes.size10}>
            {!checked ? <a href="javascript:void(0)" style={{color: '#046eb9'}}>
              <strong
                onClick={() => {setChecked(true)}}
                style={{cursor: "pointer"}}>click to view</strong></a> :
              <img src={'/'+message.msg} className={classes.photo} alt="message_photo" />}
            </span>
            :
                <div  className={classes.message}
                >
                { emojiOption ?
                    makeTag(message.msg)
                    :
                    makeTagWithCustom(message.msg)
                }
                </div>
            }
            </>
                <div className={classes.date}>{moment(message.date).format('hh:mm')}</div>
            </div>
        </div>
    )
}

export default StyledMessage;