import React, { useState, useRef, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './styles';
import InputEmoji from './InputEmoji';
import ColorPicker from './ColorPicker';
import {EmojiConvertor} from 'emoji-js';
import { getSocket } from '../../utils';



const ChatForm = ({roomName, to, sendMessage, onFocus, onBlur}) => {
    const classes = useStyles();
    const [msg, setMsg] = useState('');
    const formRef = useRef(null);
    const [userColor, setUserColor] = useState(null);
    const [bold, setBold] = useState(false);
    const emoji = new EmojiConvertor();
    
    const onFinish = (e) => {
        e.preventDefault();
        // sendMessage();
    };

    useEffect(() => {
        emoji.img_set = 'apple';
        emoji.img_sets.apple.path = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/';
        emoji.use_sheet = true;
        emoji.init_env();
        emoji.supports_css = false;
        emoji.allow_native = false;
        emoji.replace_mode = 'img';// 'unified';
        emoji.use_sheet = true;
    }, [])


    // const sendMessage = () => {
    //     let realMsg = msg.trim();
    //     // console.log('realMsg', realMsg);
    //     let color = userColor? userColor: 'black';


    //     if (realMsg) {
    //         const date = Date.now();
    //         if(to) {
    //             // console.log(username, to);
    //             socket.emit('private message', { msg: realMsg, room: roomName, from: username, to, date, color, bold });
    //         } else{
    //             // console.log(username, room.name, to);
    //             socket.emit('public message', { msg: realMsg, room: roomName, from: username, date, color, bold });
    //         }
            
    //         setMsg('');
    //     }
    // }

    const handleOnEnter = () => {
        let realMsg = msg.trim();
        let color = userColor? userColor: 'black';
        if(realMsg) {
            setTimeout(() => {sendMessage(roomName, to, color, realMsg, bold);}, 0);
            setMsg('');
        }
        
    }
    
    return (
        <div className={classes.inputArea}>
            <form className={classes.inputForm} onSubmit={onFinish} ref={formRef}>
                <div className={classes.addButton}>
                    {/* <IconButton aria-label="send"
                        variant="contained"
                        color="primary"
                    > */}
                        <AddIcon fontSize="small"/>
                    {/* </IconButton> */}
                </div>
                <div className={classes.boldSelector} onClick={() => setBold(!bold)}>
                    <span className={bold?classes.bold: ''}>B</span>
                </div>
                <ColorPicker userColor={userColor} setUserColor={setUserColor} />
                
                <InputEmoji
                    value={msg}
                    onChange={setMsg}
                    cleanOnEnter
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onEnter={handleOnEnter}
                    color={userColor ? userColor: 'black'}
                    fontWeight={bold?'bold': 'inherit'}
                    placeholder="Type a message"
                />
                
            </form>
        </div>
    )
}

export default ChatForm;