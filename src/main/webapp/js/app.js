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
    }).state('add', {
        url:'/add',
        templateUrl:'partials/edit.html',
        controller:'AddCtrl'
    }).state('edit',{
        url:'/edit',
        templateUrl:'partials/edit.html',
        controller:'EditCtrl'
    }).state('history',{
        url:'/history',
        templateUrl:'partials/history.html',
        controller:'HistoryCtrl'
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
}).controller('MainCtrl', function ($log, $scope, $http, $state, service) {
    $scope.logout = service.logout;
    var get = $http.get('api/tasks');///TODOList
    get.success(function (data) {
        $scope.items = data;
    });
    get.error(function (data, status, headers, cinfig) {
        $log.log('No data received');
    });
    $scope.addItem=function (){
        $state.go('add');
    };
    $scope.showHistory=function (){
        $state.go('history');
    };
}).controller('LoginCtrl', function ($scope, $state) {
    //if($scope.login&&$scope.password)
    $scope.doLogin = function () {
        $state.go('main');
    };
}).controller('EditCtrl', function ($scope, statuses) {
    $scope.action = "Edit Item";
    $scope.statuses = statuses;
}).controller('HistoryCtrl', function ($scope) {

}).controller('AddCtrl', function ($scope, statuses) {
    $scope.action = "Add Item";
    $scope.statuses = statuses;
}).controller('HistoryCtrl', function ($scope){

}).factory('statuses',function (){
    return ['High','Medium','Low'];
});
