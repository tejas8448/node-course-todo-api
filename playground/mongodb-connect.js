const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('connection failed to mongodb server');
    }
    console.log('connected to mongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'something to dp',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Tejas Patel',
    //     age: 24,
    //     location: 'Ahmedabad'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    db.close();
});