// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('connection failed to mongodb server');
    }
    console.log('connected to mongoDB server');

   
    db.collection('Users').find({name: 'Tejas Patel'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined,2));
    });
    // db.close();
});