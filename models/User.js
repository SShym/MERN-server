const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    skills: {
        type: Array,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String
    },
    avatarId: {
        type: String
    }
})

module.exports = mongoose.model('eye-user', User);