import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import Backend from 'i18next-xhr-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';

import en_lang from './locales/en/translation.json';
import iw_lang from './locales/iw/translation.json';

const resources = {
  en: {
    translation: en_lang
  },
  iw: {
    translation: iw_lang
  }
};

var default_language = 'en';
// var admin_setting = JSON.parse(localStorage.getItem("admin_setting"));
// console.log("i18n  admin_setting : ", admin_setting)
// if(admin_setting !== null) {
//   default_language = admin_setting.language;
// }

i18n
  // .use(Backend)
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    lng: default_language,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });


export default i18n;