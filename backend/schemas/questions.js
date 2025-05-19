const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    senderID: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
