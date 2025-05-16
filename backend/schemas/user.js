const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.statics.signup = async function (userId, password) {
    // validation
    if (!userId || !password) {
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

    const user = await this.create({ userId, password });
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