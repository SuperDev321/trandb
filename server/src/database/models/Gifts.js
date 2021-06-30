const { Schema, model } = require('mongoose');

const giftSchecma = new Schema({
    name: { type: String, required: true },
    src: String,
    cost: { type: Number, required: true },
    detail: String,
    imageSrc: String
});

const Gifts = model('Gifts', giftSchecma);

module.exports = Gifts;
