import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const useSetting = () => {

  const currentMessageSize = parseInt(window.localStorage.getItem('messageSize'), 10) || 12;
  const currentLanguage = localStorage.getItem('language');
  
  const [defaultTheme, setDefaultTheme] = useState(false);
  const [messageSize, _setMessageSize] = useState(currentMessageSize);
  const [enablePokeSound, _setEnablePokeSound] = useState(true);
  const [enablePublicSound, _setEnablePublicSound] = useState(true);
  const [enablePrivateSound, _setEnablePrivateSound] = useState(true);
  const [language, _setLanguage] = useState(null);
  const [messageNum, setMessageNum] = useState(30);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const currentPokeSound = localStorage.getItem('poke-sound');
    if(!currentPokeSound) {
      setEnablePokeSound(true);
    } else {
      if(currentPokeSound === 'on') {
        _setEnablePokeSound(true);
      } else {
        _setEnablePokeSound(false);
      }
    }
    
    const currentPrivateSound = localStorage.getItem('private-sound');
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
    axios.get(`${config.server_url}/api/setting`)
    .then((response) => {
      if(response.status === 200) {
        let data = response.data;
        if(data) {
          const {theme, messageNum, language} = data;
          setDefaultTheme(theme);
          if(!currentLanguage)
            setLanguage(language);
          else {
            setLanguage(currentLanguage);
          }
          if(messageNum) {
            setMessageNum(messageNum);
          }
        }
      }
    })
  }, []);

  const setMessageSize = (messageSize) => {
    localStorage.setItem('messageSize', messageSize);
    _setMessageSize(messageSize);
  }

  const setLanguage = (language) => {
    console.log('setLanguage', language)
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
    language, setLanguage, messageNum};
};

export default useSetting;
