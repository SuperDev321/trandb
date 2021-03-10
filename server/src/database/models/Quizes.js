const { Schema, model } = require('mongoose');

const quizSchema = new Schema({
  question: { type: String , required: true},
  answer: {type: String, required: true},
});

const Quizes = model('Quizes', quizSchema);

module.exports = Quizes;