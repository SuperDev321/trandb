const { ForbiddenWords } = require('../../database/models');
const BreakEvent = 'BREAK_EVENT'
const isForbidden = async (word) => {
    try {
        let result = await ForbiddenWords.findOne({word}).lean();
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
        let words = await ForbiddenWords.find({}).lean();
        let lowText = text.toLowerCase();
        words.forEach(({word}) => {
            if(lowText.includes(word.toLowerCase())) {
                throw BreakEvent;
            }
        })
        return false;
    } catch (err) {
        if (err === BreakEvent) return true
        else return false;
    }
}

module.exports = {isForbidden, hasFobiddenWord};