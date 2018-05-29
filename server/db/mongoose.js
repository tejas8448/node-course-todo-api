const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://tejas8448:15Tejas7510@ds137720.mlab.com:37720/learning-node' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};