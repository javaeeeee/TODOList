
//Add a module to the application
angular.module('app', ['ui.router', 'ngResource'])
        //Describe application states
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            }).state('main', {
                url: '/main',
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            }).state('add', {
                url: '/add',
                templateUrl: 'partials/edit.html',
                controller: 'AddCtrl'
            }).state('edit', {
                url: '/edit{id}',
                templateUrl: 'partials/edit.html',
                controller: 'EditCtrl'
            }).state('history', {
                url: '/history',
                templateUrl: 'partials/history.html',
                controller: 'HistoryCtrl'
            }).state('delete', {
                url: '/main{id}',
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            });
            $urlRouterProvider.otherwise('login');
        })
        //A factory that produces a resource to work with TODO items  
        .factory('Item', function ($resource) {
            return $resource('api/tasks/:id', null, {
                'update': {
                    method: 'PUT'
                }
            });
        })
        //A factory with special methods for login and logout
        .factory('service', function ($state) {
            var logout = function () {
                $state.go('login');
            };
            var getAuthenticatedUser = function (login, password) {

            };
            return {
                logout: logout
            };
        })
        // A factory to produce atatuses of TODO items        
        .factory('statuses', function () {
            return ['High', 'Medium', 'Low'];
        })
        //Controller of the main page
        .controller('MainCtrl', function ($log, $scope, $state, $window, service, Item) {
            $scope.logout = service.logout;
            Item.query(function (items) {
                $scope.items = items;
            });
            $scope.addItem = function () {
                $state.go('add');
            };
            $scope.showHistory = function () {
                $state.go('history');
            };
            $scope.deleteItem = function (id) {
                Item.delete({id: id},function(){
                    $window.location.reload();
                });
            };
        })
        //Controller of the login page
        .controller('LoginCtrl', function ($log, $scope, $state, $resource, $http) {
            //if($scope.login&&$scope.password)
            //TODO A temporary stub
            $scope.doLogin = function () {
                $state.go('main');
            };
        })
        //Controller to edit TODO items
        .controller('EditCtrl', function ($log, $scope, $stateParams, $state, statuses, Item) {
            $scope.action = "Edit Item";
            $scope.statuses = statuses;
            $scope.item = Item.get({id: $stateParams.id});
            $scope.saveItem = function () {
                var $id = $scope.item.id;
                Item.update({id: $id}, $scope.item, function () {
                    $state.go('main');
                }, function (reason) {
                    $log.error('An error occured saving an item ' + reason.status);
                    $log.debug('data = ' + JSON.stringify(reason.config.data));//JSON.stringify(reason)
                });
            };
        })
        //Controller for a history page        
        .controller('HistoryCtrl', function ($scope) {

        })
        // Controller for adding items
        .controller('AddCtrl', function ($log, $scope, $state, $resource, statuses, Item) {
            $scope.action = "Add Item";
            $scope.statuses = statuses;
            $scope.item = new Item();
            $scope.item.name = "dgdgdg";
            //TODO a temporary stub
            var User = $resource('api/user/:id', {id: '@id'});

            $scope.saveItem = function () {
                $log.debug('Saving an item');
                User.get({id: 1}, function (user) {
                    $scope.item.userId = user;
                    Item.save($scope.item, function () {
                        $state.go('main');
                    });
                }, function (reason) {
                    $log.error('Failed to load users. Status ' + reason.status);
                });
            };
        });
