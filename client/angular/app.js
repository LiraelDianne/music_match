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
        .when('/animate', {
            templateUrl: '../partials/animatetest.html',
            controller: 'animateController'
        })
        .otherwise({
            redirectTo: '/'
        })
})
