const { ForbiddenWords } = require('../../database/models');

const isForbidden = (word) => {
    try {
        let result = await ForbiddenWords.find({word});
        if(result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}