const {Settings} = require('../../database/models');

// update a admin setting
const updateSetting = async (req, res, next) => {
    try {
        let {language, theme, messageNum} = req.body;
        let result = await Settings.updateOne({type: 'admin'}, {language, theme, messageNum});
        res
        .status(204)
        .json({});
    } catch (err) {
        console.log(err)
        next(err);
    }
}

module.exports = updateSetting;