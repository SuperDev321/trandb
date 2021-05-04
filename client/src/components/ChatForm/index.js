import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useStyles from './styles';
import InputEmoji from './InputEmoji';
import ColorPicker from './ColorPicker';
// import {EmojiConvertor} from 'emoji-js';
// import { getSocket } from '../../utils';
import axios from 'axios';
import config from '../../config';
import {UserContext} from '../../context';
import {useTranslation} from 'react-i18next';
import {CustomThemeContext} from '../../themes/cutomThemeProvider';

const ChatForm = ({roomName, to, sendMessage, onFocus, onBlur, type, blocked}) => {
    const {role} = useContext(UserContext);
    const classes = useStyles();
    const {t} = useTranslation();
    const [msg, setMsg] = useState('');
    const formRef = useRef(null);
    const [userColor, setUserColor] = useState('default');
    const [bold, setBold] = useState(false);
    // const emoji = new EmojiConvertor();
    const {currentTheme} = useContext(CustomThemeContext);
    const onFinish = (e) => {
        e.preventDefault();
    };

    // useEffect(() => {
    //     emoji.img_set = 'apple';
    //     emoji.img_sets.apple.path = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-64/';
    //     emoji.use_sheet = true;
    //     emoji.init_env();
    //     emoji.supports_css = false;
    //     emoji.allow_native = false;
    //     emoji.replace_mode = 'img';// 'unified';
    //     emoji.use_sheet = true;
    // }, []);

    const sendFileMessage = useCallback((file) => {
        if(blocked) {
            return;
        }
        const data = new FormData();
        data.append('file_icon', file);
        
        axios.post(config.server_url + '/api/file_upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            if(response.status === 200) {
                let fileUrl = response.data.photoUrl;
                sendMessage(roomName, to, userColor, fileUrl, null, type, 'image');
            }
        })
    }, [roomName, to, type, userColor]);
    const handleChangeFile = (files, type) => {
        if(files[0]) {
            let file = files[0];
            sendFileMessage(file);
        }
    }
    const defaultColor = currentTheme === 'normal'? '#000': '#fff';
    const colorPickBackground = currentTheme === 'normal'? '#fff': '#263238';

    const handleOnEnter = (msg) => {
        let realMsg = msg.trim();
        if(realMsg) {
            if(!blocked) {
                setTimeout(() => {
                    sendMessage(roomName, to, userColor, realMsg, bold, type, 'general');
                }, 0);
            }
            setMsg('');
        }
    }
    
    return (
        <div className={classes.inputArea}>
            <form className={classes.inputForm} onSubmit={onFinish} ref={formRef}>
                { role !== 'guest'?
                <div  className={classes.fileUpload}>
                
                <label className={classes.fileUploadLabel}><CloudUploadIcon fontSize="small"/>
                    <input type="file" className={classes.fileUploadInput}
                        onChange={(e) => handleChangeFile(e.target.files)}
                    />
                </label>
                        
                </div>:null
                }
                <div className={classes.boldSelector} onClick={() => setBold(!bold)}>
                    <span className={bold?classes.bold: ''}>B</span>
                </div>
                <ColorPicker userColor={userColor} setUserColor={setUserColor}
                defaultColor={defaultColor} backgroundColor={colorPickBackground} />
                
                <InputEmoji
                    value={msg}
                    onChange={setMsg}
                    cleanOnEnter
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onEnter={handleOnEnter}
                    color={userColor === 'default' ? defaultColor: userColor}
                    fontWeight={bold?'bold': 'inherit'}
                    placeholder={t('InputMessage.type_message')}
                />
                
            </form>
        </div>
    )
}

export default ChatForm;