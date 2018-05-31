const mongoose = require('mongoose');
let env = process.env.NODE_ENV || 'development';
mongoose.Promise = global.Promise;
if(env === 'development'){
    mongoose.connect( 'mongodb://localhost:27017/TodoApp');
    console.log('TodoApp database connected');
} else if(env === 'test') {
    mongoose.connect( 'mongodb://localhost:27017/TodoAppTest');
    console.log('TodoAppTest database connected');
}else {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://tejas8448:15Tejas7510@ds137720.mlab.com:37720/learning-node' || 'mongodb://localhost:27017/TodoApp');
    console.log('TodoApp MLAB database connected');
}


module.exports = {
    mongoose
};