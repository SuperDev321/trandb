import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {EmojiConvertor} from 'emoji-js';
import parseHTML from 'parsehtml';
import moment from 'moment';
import randomstring from "randomstring";
import {grey, blue} from '@material-ui/core/colors'
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
        background: grey[100],
        color: (props) => 
        props.color
        ?props.color
        :theme.palette.getContrastText(grey[100]),
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
        boxShadow: '0 0 6px 1px #00000052',
    },
    date: {
        fontSize: 12
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

const StyledMessage = ({message, mine}) => {
    const [checked, setChecked] = useState(false);
    const classes = useStyles({mine, color: message.color, bold: message.bold});
    // const emojiConverter = (text) => {
    //     return emoji.replace_unified(text);
    // }
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
                                onClick={() => {window.open(url, '_blank');}}>{url}</span>)
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
                                onClick={() =>{window.open(url, '_blank');} }>{url}</span>)
            } else{
                result.push(<span key={key}>{html.innerHTML}</span>)
            }
        }
        return result
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
              <img src={'/'+message.msg} className={classes.photo}/>}
            </span>
            :
                <div  className={classes.message}
                //  dangerouslySetInnerHTML={{__html: emojiConverter(message.msg)}}
                >
                    {
                convertHTML(makeTag(emojiConverter(message.msg)))
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