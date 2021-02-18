const { Schema, model } = require('mongoose');
const { string } = require('yup');

const forbiddenWordSchema = new Schema({
    word: {
        type: String,
        required: true
    }
});

const ForbiddenWords = model('ForbiddenWords', forbiddenWordSchema);

module.exports = ForbiddenWords;