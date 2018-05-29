const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/user');

let id = '5b0b1b8ebeac670ae88ff0b7';

Users.findById(id).then((user) => {
    if(!user) {
        return console.log('user not found.');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));