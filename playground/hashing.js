const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

let hashedPassword = '$2a$10$lCxtWM6DLG08VnuoNMNgduJP5prU2zPJLnN5v6YJd5J83yYxM15b.'
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
// let body = {
//     id: 10
// }

// let token = jwt.sign(body, 'todofl');
// console.log(token);

// let decode = jwt.verify(token, 'todoflwww');
// console.log(decode);





// const {SHA256} = require('crypto-js');

// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);