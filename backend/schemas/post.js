const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    likes:{
        type:Number,
        default:0
    },
    imageURL:{
        type: String,
        default: ""
    }
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;