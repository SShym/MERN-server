const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skills: {
        type: Array,
    },
    email: {
        type: String,
        required: true,
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