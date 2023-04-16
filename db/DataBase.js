const mongoose = require('mongoose');
require('dotenv').config();

const Database = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })   
        console.log('Connected Successfully to MongoDB')
    } catch(err){
        console.log(err.message)
    }

}

module.exports = Database;