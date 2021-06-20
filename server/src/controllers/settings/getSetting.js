const { Settings } = require('../../database/models');

const getSetting = async (req, res, next) => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(setting) {
            const { theme, language, messageNum, allowPrivate, messageTimeInterval,
                maxUsernameLength, maxMessageLength, avatarOption, avatarColor, bypassBan, allowGuestAvatarUpload } = setting;
            res
            .status(200)
            .json({
                theme,
                language,
                messageNum,
                allowPrivate,
                messageTimeInterval,
                maxUsernameLength,
                maxMessageLength,
                avatarOption,
                avatarColor,
                bypassBan,
                allowGuestAvatarUpload
            })
        }
    } catch(err) {

    }
}

module.exports =  getSetting;