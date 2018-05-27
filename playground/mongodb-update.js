// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('connection failed to mongodb server');
    }
    console.log('connected to mongoDB server');
   
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b0a8529bf6df89ffccab77d')
    // },
    // {
    //     $set: {
    //         completed: true
    //     }    
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b0b08e7afa7d2efa72281cc')
    }, {
        $inc: {
            age: 1
        },
        $set: {
            name: 'Arpit Patel'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    // db.close();
});