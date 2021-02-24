const { Settings } = require('../../database/models');

const getSetting = async (req, res, next) => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(setting) {
            let {theme, language, messageNum} = setting;
            res
            .status(200)
            .json({
                theme,
                language,
                messageNum
            })
        }
    } catch(err) {

    }
}

module.exports =  getSetting;