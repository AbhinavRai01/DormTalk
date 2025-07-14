const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    parentID: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    }
})

mongoose.model('Comment', commentSchema);
module.exports = commentSchema;