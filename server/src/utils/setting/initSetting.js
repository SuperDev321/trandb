const { Settings } = require("../../database/models")

const initSetting = async () => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(!setting) {
            await Settings.create({type: 'admin', theme: 'normal', messageNum: 30,
                language: 'en', allowPrivate: true, messageTimeInterval: 200,
                maxUsernameLength: 10, maxMessageLength: 200,
                avatarOption: true, avatarColor: true, bypassBan: true
            });
        }
    } catch(err) {

    }
}
module.exports = initSetting;