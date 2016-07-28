console.log('angular app')
var app = angular.module('app', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../partials/game.html',
            controller: 'gameController'
        })
        .when('/login', {
            templateUrl: '../partials/signin.html',
            controller: 'loginController'
        })
        .when('/audio', {
            templateUrl: '../partials/audiotest.html',
            controller: 'audioController'
        })
        .otherwise({
            redirectTo: '/'
        })
})
