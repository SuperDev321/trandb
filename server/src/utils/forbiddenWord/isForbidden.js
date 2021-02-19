const { ForbiddenWords } = require('../../database/models');

const isForbidden = async (word) => {
    try {
        let result = await ForbiddenWords.findOne({word});
        console.log('check forbidden', word, result)
        if(result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

const hasFobiddenWord = async (words) => {
    try {
        let result = await ForbiddenWords.findOne({word: {$in: words}});
        if(result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

module.exports = {isForbidden, hasFobiddenWord};