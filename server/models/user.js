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

// function used for sending only poperty that we want in response while user sign up. We won't sent password or tokens. 
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

// function for generating authentication token while sign up. It uses jsonwebtoken. then it saves token and access property of tokens. 
UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abd174713').toString(); 
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

// function used to authenticate user login. It takes token from request and then decode it so that it can find user with id and token releted to it.  
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

// this function is used for comparing the password with user password after finding user from database with email
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject();
                }   
            });
        });
    });    
};

// following function will run before save action in database when password property is modified. It will hash the password using bcryptjs and update the password in database to hash password. 
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