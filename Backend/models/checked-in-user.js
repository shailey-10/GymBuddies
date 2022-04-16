const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const checkedInUserSchema =new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    image: {type: String, required: true},
    regNo:{type: String, required: true},
    posts: [{type: mongoose.Types.ObjectId, required: true, ref: 'Post'}]
});


module.exports = mongoose.model('CheckedInUser', checkedInUserSchema);