const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    questionID: {
        type: String,
        required: true
    },
    senderID: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    }, likes: {
        type: Number,
        default : 0
    }
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
