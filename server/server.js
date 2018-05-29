const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectId} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {Users} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// post request for todos
app.post('/todos', (req, res) => {
    
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    },(e) => {
        res.status(400).send(e);
    });
});

// get request for all todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// get request for individual todo
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

// delete request for individial todo
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

module.exports = {app};