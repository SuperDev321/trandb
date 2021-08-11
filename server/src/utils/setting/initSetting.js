const { Settings } = require("../../database/models")

const initSetting = async () => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(!setting) {
            await Settings.create({type: 'admin', theme: 'normal', messageNum: 30,
                language: 'en', allowPrivate: true, messageTimeInterval: 200,
                maxUsernameLength: 10, maxMessageLength: 200,
                avatarOption: true, avatarColor: true, bypassBan: true, allowGuestAvatarUpload: false,
                showGiftMessage: true, showGift: true, pointOption: false, autoBroadcast: false
            });
        }
    } catch(err) {

    }
}
module.exports = initSetting;