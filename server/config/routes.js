console.log('routes')
var users = require('../controllers/users')

module.exports = function(app){
    //users
    app.get('/users', users.index);
    app.get('/users/login/:name', users.login);
    app.get('/users/session', users.getSessionInfo)
    app.get('/users/:id', users.show);
    app.post('/users', users.create);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);
}
