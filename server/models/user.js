const mongoose = require('mongoose');
const validator =  require('validator');
const jwt = require('jsonwebtoken');
const _ =require('lodash');
const bcrypt = require('bcryptjs');
let UserSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not a valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abd174713').toString(); 
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abd174713');
    } catch (e) {
       return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10,(err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let Users = mongoose.model('Users', UserSchema);

module.exports = {Users};