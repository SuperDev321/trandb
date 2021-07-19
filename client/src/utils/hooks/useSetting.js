import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { useTranslation } from 'react-i18next';
import useLocalStorage from './useLocalStorage'
const useSetting = () => {

  const currentMessageSize = parseInt(window.localStorage.getItem('messageSize'), 10) || 16;
  
  
  const [defaultTheme, setDefaultTheme] = useState(false);
  const [messageSize, _setMessageSize] = useState(currentMessageSize);
  const [enablePokeSound, _setEnablePokeSound] = useState(true);
  const [enablePublicSound, _setEnablePublicSound] = useState(true);
  const [enablePrivateSound, _setEnablePrivateSound] = useState(true);
  const [enableGuestPrivate, setEnableGuestPrivate] = useState(true);
  const [messageTimeInterval, setMessageTimeInterval] = useState(200)
  const [maxUsernameLength, setMaxUsernameLength] = useState(10)
  const [maxMessageLength, setMaxMessageLength] = useState(200)
  const [language, _setLanguage] = useState(null);
  const [messageNum, setMessageNum] = useState(30);
  const [enableSysMessage, _setEnableSysMessage] = useState(true);
  const [privateMutes, setPrivateMutes] = useLocalStorage('private-mutes', []);
  const [avatarOption, setAvatarOption] = useState(true);
  const [avatarColor, setAvatarColor] = useState(true);
  const [allowGuestAvatarUpload, setAllowGuestAvatarUpload] = useState(false)
  const [pointOption, setPointOption] = useState(false)
  const [showGift, _setShowGift] = useState(false)
  const [showGiftMessage, _setShowGiftMessage] = useState(false);
  const [emojiOption, setEmojiOption] = useState(true);
  const { t, i18n } = useTranslation();
  const setMessageSize = (messageSize) => {
    localStorage.setItem('messageSize', messageSize);
    _setMessageSize(messageSize);
  }

  const setLanguage = (language) => {
    localStorage.setItem('language', language);
    _setLanguage(language);
    i18n.changeLanguage(language)
  }

  const setEnablePrivateSound = (setting) => {
    if(setting)
      localStorage.setItem('private-sound', 'on');
    else localStorage.setItem('private-sound', 'off');
    _setEnablePrivateSound(setting);
  }
  const setEnablePublicSound = (setting) => {
    if(setting)
      localStorage.setItem('public-sound', 'on');
    else localStorage.setItem('public-sound', 'off');
    _setEnablePublicSound(setting);
  }
  const setEnablePokeSound = (setting) => {
    if(setting)
      localStorage.setItem('poke-sound', 'on');
    else localStorage.setItem('poke-sound', 'off');
    _setEnablePokeSound(setting);
  }
  const setEnableSysMessage = (setting) => {
    if(setting) {
      localStorage.setItem('system-message', 'on');
      _setEnableSysMessage(true);
    } else {
      localStorage.setItem('system-message', 'off');
      _setEnableSysMessage(false);
    }
  }
  const setShowGiftMessage = (setting) => {
    if(setting) {
      localStorage.setItem('gift-message', 'on');
      _setShowGiftMessage(true);
    } else {
      localStorage.setItem('gift-message', 'off');
      _setShowGiftMessage(false);
    }
  }
  const setShowGift = (setting) => {
    if(setting) {
      localStorage.setItem('gift-movie', 'on');
      _setShowGift(true);
    } else {
      localStorage.setItem('gift-movie', 'off');
      _setShowGift(false);
    }
  }

  const addPrivateMute = (mute) => {
    if (mute && mute.username && mute.ip) {
      let oldOne = privateMutes?.find((item) => (item.username===mute.username && item.ip === mute.ip))
      if (!oldOne) {
        setPrivateMutes([...privateMutes, mute])
      }
    }
  }

  const removePrivateMute = (mute) => {
    if (mute && mute.username && mute.ip) {
      let newMutes = privateMutes?.filter((item) => (item.username !== mute.username && item.ip !== mute.ip))
      setPrivateMutes(newMutes)
    }
  }

  useEffect(() => {
    const currentPokeSound = localStorage.getItem('poke-sound');
    const currentLanguage = localStorage.getItem('language');
    const currentPrivateSound = localStorage.getItem('private-sound');
    const currentShowGift = localStorage.getItem('gift-movie');
    const currentShowGiftMessage = localStorage.getItem('gift-message');
    if(!currentPokeSound) {
      setEnablePokeSound(true);
    } else {
      if(currentPokeSound === 'on') {
        _setEnablePokeSound(true);
      } else {
        _setEnablePokeSound(false);
      }
    }
    
    if(!currentPrivateSound) {
      setEnablePrivateSound(true)
    } else {
      if(currentPrivateSound === 'on') {
        _setEnablePrivateSound(true);
      } else {
        _setEnablePrivateSound(false);
      }
    }
   
    const currentPublicSound = localStorage.getItem('public-sound');
    if(!currentPublicSound) {
      setEnablePublicSound(true)
    } else {
      if(currentPublicSound === 'on') {
        _setEnablePublicSound(true);
      } else {
        _setEnablePublicSound(false);
      }
    }
    const currentSysMessageState = localStorage.getItem('system-message');
    if(!currentSysMessageState) {
      setEnableSysMessage(true)
    } else {
      if(currentSysMessageState === 'on') {
        _setEnableSysMessage(true);
      } else {
        _setEnableSysMessage(false);
      }
    }
    axios.get(`${config.server_url}/api/setting`)
    .then((response) => {
      if(response.status === 200) {
        let data = response.data;
        if(data) {
          const { theme, messageNum, language, allowPrivate, messageTimeInterval, maxMessageLength, avatarOption, avatarColor, 
            allowGuestAvatarUpload, showGift, showGiftMessage, pointOption, emojiOption } = data;
          setDefaultTheme(theme);
          if(!currentLanguage)
            setLanguage(language);
          else {
            setLanguage(currentLanguage);
          }
          if(messageNum) {
            setMessageNum(messageNum);
          }
          if (messageTimeInterval) {
            setMessageTimeInterval(messageTimeInterval);
          }
          if (maxUsernameLength) {
            setMaxUsernameLength(maxUsernameLength)
          }
          if (maxMessageLength) {
            setMaxMessageLength(maxMessageLength)
          }
          setAvatarOption(avatarOption);
          setEnableGuestPrivate(allowPrivate);
          setAvatarColor(avatarColor);
          setAllowGuestAvatarUpload(allowGuestAvatarUpload);
          setPointOption(pointOption);
          setEmojiOption(emojiOption)
          if (!currentShowGift) {
            setShowGift(showGift);
          } else {
            if (currentShowGift === 'on') {
              _setShowGift(true);
            } else {
              _setShowGift(false);
            }
            
          }
          if (!currentShowGiftMessage) {
            setShowGiftMessage(showGiftMessage);
          } else {
            if (currentShowGiftMessage === 'on') {
              _setShowGiftMessage(true);
            } else {
              _setShowGiftMessage(false);
            }
          }
        }
      }
    })
  }, []);

  
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await axios.get(`${config.server_url}/api/setting`);
//       } catch (err) {
//         setLoading(false);
//       }
//     })();
//   }, [auth]);

  return { defaultTheme, messageSize, enablePokeSound, enablePrivateSound, enablePublicSound,
    setDefaultTheme, setMessageSize, setEnablePokeSound, setEnablePrivateSound, setEnablePublicSound,
    language, setLanguage, messageNum, enableSysMessage, setEnableSysMessage, enableGuestPrivate,
    messageTimeInterval, maxUsernameLength, maxMessageLength, privateMutes, addPrivateMute, removePrivateMute,
    avatarOption, avatarColor, allowGuestAvatarUpload, pointOption, showGift, showGiftMessage, setShowGift, setShowGiftMessage,
    emojiOption
  };
};

export default useSetting;
