const jwt = require('jsonwebtoken');

let body = {
    id: 10
}

let token = jwt.sign(body, 'todofl');
console.log(token);

let decode = jwt.verify(token, 'todoflwww');
console.log(decode);





// const {SHA256} = require('crypto-js');

// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);