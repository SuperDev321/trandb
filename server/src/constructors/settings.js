const {Settings} = require('../database/models');
const moment = require('moment');

class AdminSetting {
  constructor() {
    this.settings = {};
    Settings.findOne({type: 'admin'}, (err, result) => {
      if(err) {
        console.log(err);
      } else {
        if(result) {
          const {theme, language, messageNum, allowPrivate} = result;
          this.settings = {theme, language, messageNum, allowPrivate};
        }
      }
    })

  }

  getSettings() {
    return this.settings;
  }

  updateLanguage(sel_lang) {
    this.settings.language = sel_lang;
  }

  updateGuestPrivate(sel_private) {
    this.settings.guest_private = parseInt(sel_private);
  }

  updateGuestBroadcast(sel_broadcast) {
    this.settings.guest_broadcast = parseInt(sel_broadcast);
  }

  updateMaxMessageSize(sel_max_message_size) {
    this.settings.max_message_size = parseInt(sel_max_message_size);
  }

  updateMessageTimeInterval(sel_message_time_interval) {
    this.settings.message_time_interval = parseInt(sel_message_time_interval);
  }

}

module.exports = {AdminSetting};
