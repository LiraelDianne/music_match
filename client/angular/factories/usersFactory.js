console.log('users Factory');
app.factory('usersFactory', ['$http', function($http) {
    // constructor for our factory
    var users = [];
    var user = {};

    function usersFactory(){
        var _this = this;
        this.index = function(callback){
            //set the users variable
            $http.get('/users').then(function(returned_data){
                users = returned_data.data;
                if (typeof(callback) == 'function') {
                    callback(users);
                }
            });
        };
        this.create = function(newuser,callback){
            $http.post('/users', newuser).then(function(returned_data){
                user = returned_data.data.user
                if (typeof(callback) == 'function'){
                    callback(returned_data);
                }
            });
        };
        this.update = function(user, update, callback){
            $http.put('/users/'+user._id, update).then(function(returned_data){
                console.log(returned_data.data)
                if (typeof(callback) == 'function') {
                    callback(returned_data.data)
                }
          });
        };
        this.login = function(user,callback){
            $http.get('/users/login/'+user.name).then(function(returned_data) {
                if(returned_data.status) {
                    user = returned_data.data.user
                }
                if (typeof(callback) == 'function'){
                    callback(returned_data);
                }
            })
        };
        this.logout = function() {
            user = {}
            $http.get('/users/logout')
        }
        // get session information
        this.success = function(callback){
            if (user.name) {
                callback(user);
            } else {
                $http.get('/users/session').then(function(returned_data) {
                    callback(returned_data.data.user)
                })
            }
        };
    }
    return new usersFactory();
}]);
