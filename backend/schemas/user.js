const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers:{
        type: Number,
        default: 0
    },
    likedQuestions: {
        type: [String],
        default: []
    },
    likedAnswers: {
        type: [String],
        default: []
    },
    followedUsers: {
        type: [String],
        default: []
    },
    joinedClusters: {
        type: [String],
        default: [],
    },
    imageURL:{
        type: String,
        default:"https://firebasestorage.googleapis.com/v0/b/forumapp-fead5.firebasestorage.app/o/profilephotos%2Fpp.jpg?alt=media&token=62168b08-8a30-4a39-a0b8-57c9af414224"
    },
    bio:{
        type: String,
        default: "Doesn't care enough to write a bio"
    }
}, { timestamps: true });

userSchema.statics.signup = async function (name, userId, password) {
    // validation
    if (!name || !userId || !password) {
        throw Error('All fields must be filled');
    }
    if (password.length < 6) {
        throw Error('Password must be at least 6 characters long');
    }

    const exists = await this.findOne({ userId });
    if (exists) {
        throw Error('User already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    password = hash;

    const user = await this.create({name, userId, password });
    return user;
}

userSchema.statics.login = async function (userId, password) {
    // validation
    if (!userId || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ userId });
    if (!user) {
        throw Error('Incorrect userId');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);