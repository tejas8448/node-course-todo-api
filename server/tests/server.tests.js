const expect = require('expect');
const request = require('supertest');
const {ObjectID}   = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST/todos', () => {

    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body',(done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET/ todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET/todos/:id', () => {
    it('should return the doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
});

describe('DELETE/todos/:id', () => {
    it('should delete a todo', (done) => {
        let id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {

        let hexID = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if objectID is invalid', (done) => {

        request(app)
            .delete('/todos/2434')
            .expect(404)
            .end(done);
    });
});

describe('PATCH/todos/:id', () => {

    it('should update the todo', (done) => {
        let id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'I was just updated. Hurray.',
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('I was just updated. Hurray.')
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'I was just.',
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('I was just.')
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

// test for user authentication 
describe('GET/users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('GET/users', () => {

    it('should create a user ', (done) => {
        let email = 'example@example.com';
        let password = '123abab'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
                Users.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });
    });

    it('should return validation error if request invalid', (done) => {
        let email = 'assd.dfldfl'
        let password = 'ssdd'
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        let email = 'tejas8448@gmail.com';
        let password = 'pass0987';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});