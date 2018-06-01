const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const jwt = require('jsonwebtoken');
const {Users} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'tejas8448@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abd174713').toString()
    }]
}, {
    _id: userTwoId,
    email: 'Arpit@yahoo.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abd174713').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 32341,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
         Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    Users.remove({}).then(() => {
        let userOne = new Users(users[0]).save();
        let userTwo = new Users(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
};

module.exports = {todos, populateTodos, users, populateUsers};