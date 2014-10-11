/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    }).state('main', {
        url: '/main',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
    });
    $urlRouterProvider.otherwise('login');
}).factory('users', function ($http) {
    var users;
    $http.get('/TODOList/api/user').success(function (data) {
        //$scope.users = data;
        users = data;
    });
    return users;
}).factory('items', function () {

}).factory('service', function ($state, users) {
    var logout = function () {
        $state.go('login');
    };
    var getAuthenticatedUser = function (login, password) {
        var users = users.users;
    };
    return {
        logout: logout
    };
}).controller('MainCtrl', function ($log, $scope, $http, service) {
    $scope.logout = service.logout;
    var get = $http.get('/TODOList/api/tasks');
    get.success(function (data) {
        $scope.items = data;
    });
    get.error(function (data, status, headers, cinfig) {
        $log.log('No data received');
    });
}).controller('LoginCtrl', function ($scope, $state) {
    //if($scope.login&&$scope.password)
    $scope.doLogin = function () {
        $state.go('main');
    };
}).controller('EditCtrl', function ($scope) {

});
