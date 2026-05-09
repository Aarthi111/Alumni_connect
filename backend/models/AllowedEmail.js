const mongoose = require('mongoose')
const allowedEmailSchema = new mongoose.Schema({
    email:{type:String, required: true, unique:true},
    role:{
        type:String,
        enum:['student','alumni','admin'],
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('AllowedEmail',allowedEmailSchema)