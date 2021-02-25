const { Settings } = require("../../database/models")

const initSetting = async () => {
    try {
        let setting = await Settings.findOne({type: 'admin'});
        if(!setting) {
            await Settings.create({type: 'admin', theme: 'normal', messageNum: 30, language: 'en'});
        }
    } catch(err) {

    }
}
module.exports = initSetting;