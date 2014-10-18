
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
        .factory('service', function ($state, users) {
            var logout = function () {
                $state.go('login');
            };
            var getAuthenticatedUser = function (login, password) {
                var users = users.users;
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
        .controller('MainCtrl', function ($log, $scope, $state, service, Item) {
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
                Item.delete({id: id});
            };
        })
        //Controller of the login page
        .controller('LoginCtrl', function ($log, $scope, $state, $resource, $http, users) {
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
        .controller('AddCtrl', function ($log, $scope, $state, statuses, Item, users) {
            $scope.action = "Add Item";
            $scope.statuses = statuses;
            $scope.item = new Item();
            $scope.item.name = "dgdgdg";
            $scope.item.userId = $scope.currentUser;
            $log.debug(JSON.stringify($scope.currentUser));
            $scope.saveItem = function () {
                Item.save($scope.item, function () {
                    $state.go('main');
                });
            };
        });
