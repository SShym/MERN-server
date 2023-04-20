const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: String,
    phone: String,
    skills: Array,
    email: String,
    password: String,
    avatar: String,
    avatarId: String
    
})

module.exports = mongoose.model('eye-user', User);