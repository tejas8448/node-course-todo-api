const ObjectID = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.findByIdAndRemove('5b0d515ba4706e00149b9a05').then((todo) => {
    console.log(todo);
});