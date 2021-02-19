const { Schema, model } = require('mongoose');

const forbiddenWordSchema = new Schema({
    word: {
        type: String,
        required: true
    }
});

const ForbiddenWords = model('ForbiddenWords', forbiddenWordSchema);

module.exports = ForbiddenWords;