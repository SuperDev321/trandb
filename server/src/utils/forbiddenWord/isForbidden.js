const { ForbiddenWords } = require('../../database/models');

const isForbidden = async (word) => {
    try {
        let result = await ForbiddenWords.findOne({word});
        if(result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

const hasFobiddenWord = async (text) => {
    
    try {
        let words = await ForbiddenWords.find({});
        let result = false;
        let lowText = text.toLowerCase();
        words.map(({word}) => {
            if(lowText.includes(word.toLowerCase())) {
                result = true;
            }
        })
        return result;
    } catch (err) {
        return false;
    }
}

module.exports = {isForbidden, hasFobiddenWord};