const { Settings } = require('../../database/models');

const getSetting = async (req, res, next) => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(setting) {
            const { theme, language, messageNum, allowPrivate, messageTimeInterval,
                maxUsernameLength, maxMessageLength, guestAboutMe } = setting;
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
                guestAboutMe
            })
        }
    } catch(err) {

    }
}

module.exports =  getSetting;