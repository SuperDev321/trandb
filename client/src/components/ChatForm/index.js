import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useStyles from './styles';
import InputEmoji from './InputEmoji';
import ColorPicker from './ColorPicker';
import {EmojiConvertor} from 'emoji-js';
import { getSocket } from '../../utils';
import axios from 'axios';
import config from '../../config';
import {UserContext} from '../../context';
import {useTranslation} from 'react-i18next';


const ChatForm = ({roomName, to, sendMessage, onFocus, onBlur, type}) => {
    const {role} = useContext(UserContext);
    const classes = useStyles();
    const {t} = useTranslation();
    const [msg, setMsg] = useState('');
    const formRef = useRef(null);
    const [userColor, setUserColor] = useState(null);
    const [bold, setBold] = useState(false);
    const emoji = new EmojiConvertor();
    
    const onFinish = (e) => {
        e.preventDefault();
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
    }, []);

    const sendFileMessage = useCallback((file) => {
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
                sendMessage(roomName, to, null, fileUrl, null, type, 'image');
            }
        })
    }, [roomName, to, type]);
    const handleChangeFile = (files, type) => {
        console.log('private upload type', type)
        if(files[0]) {
            let file = files[0];
            sendFileMessage(file);
        }
    }


    const handleOnEnter = () => {
        let realMsg = msg.trim();
        let color = userColor? userColor: 'black';
        if(realMsg) {
            setTimeout(() => {sendMessage(roomName, to, color, realMsg, bold, type, 'general');}, 0);
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
                    placeholder={t('InputMessage.type_message')}
                />
                
            </form>
        </div>
    )
}

export default ChatForm;