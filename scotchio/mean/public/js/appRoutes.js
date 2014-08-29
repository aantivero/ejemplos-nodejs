/**
 * Created by alex on 21/08/2014.
 */
//aca definimos las rutas de angular
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routerProvider, $locationProvider){
    $routerProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller:'MainController'
        })
        .when('/nerds', {
            templateUrl: 'views/nerd.html',
            controller: 'NerdController'
        })
        .when('/geeks', {
            templateUrl: 'views/geek.html',
            controller: 'GeekController'
        })
        .when('/tareas', {
            templateUrl: 'views/tarea.html',
            controller: 'TareaController'
        });
    $locationProvider.html5Mode(true);
}]);
//el angular template se inyecta en el div ng-view