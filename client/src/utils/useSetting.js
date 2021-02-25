import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const useSetting = () => {

  const currentMessageSize = parseInt(window.localStorage.getItem('messageSize'), 10) || 16;
  const currentLanguage = localStorage.getItem('language');
  const [defaultTheme, setDefaultTheme] = useState(false);
  const [messageSize, _setMessageSize] = useState(currentMessageSize);
  const [enablePokeSound, setEnablePokeSound] = useState(true);
  const [enablePublicSound, setEnablePublicSound] = useState(true);
  const [enablePrivateSound, setEnablePrivateSound] = useState(true);
  const [language, _setLanguage] = useState(currentLanguage);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    axios.get(`${config.server_url}/api/setting`)
    .then((response) => {
      if(response.status === 200) {
        let data = response.data;
        if(data) {
          const {theme, messageNum, language} = data;
          setDefaultTheme(theme);
          setLanguage(language);
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
    setDefaultTheme, setMessageSize, setEnablePokeSound, setEnablePrivateSound, setEnablePublicSound, language, setLanguage};
};

export default useSetting;
