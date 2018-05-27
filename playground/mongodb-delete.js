// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('connection failed to mongodb server');
    }
    console.log('connected to mongoDB server');
    // delete many 
    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });
    // delet one
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

        // db.collection('Todos').findOneAndDelete({completed: true}).then((result) => {
        //     console.log(result);
        // })

    // db.collection('Users').deleteMany({name: 'Tejas Patel'}).then((result)=> {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5b0a8a2fbf6df89ffccab939")}).then((result) => {
        console.log(result);
    });
    // db.close();
});