const { Settings } = require("../../database/models")

const initSetting = async () => {
    try {
        console.log('init setting')
        let setting = await Settings.findOne({type: 'admin'});
        if(!setting) {
            console.log('create setting')
            await Settings.create({type: 'admin', theme: 'normal', messageNum: 30, language: 'en', allowPrivate: true});
        }
    } catch(err) {

    }
}
module.exports = initSetting;