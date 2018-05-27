const mongoose = require('mongoose');

let Users = mongoose.model('Users', {
    email: {
        required: true,
        type: String,
        minlength: 1,
        trim: true
    }
});

module.exports = {Users};