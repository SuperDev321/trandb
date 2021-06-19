const {Settings} = require('../../database/models');

// update a admin setting
const updateSetting = async (req, res, next) => {
    try {
        const {language, theme, messageNum, allowPrivate, messageTimeInterval,
            maxUsernameLength, maxMessageLength, avatarOption, avatarColor} = req.body;
        await Settings.updateOne({type: 'admin'}, {language, theme,
            messageNum, allowPrivate, messageTimeInterval, maxUsernameLength, maxMessageLength,
            avatarOption, avatarColor
        });
        res
        .status(204)
        .json({});
    } catch (err) {
        console.log(err)
        next(err);
    }
}

module.exports = updateSetting;