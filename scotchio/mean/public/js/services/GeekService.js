/**
 * Created by alex on 21/08/2014.
 * Se conecta con los servicios del back end
 */
angular.module('GeekService', []).factory('Geek', ['$http', function($http){

    return {
        //get all para obtener el resu
        get: function(){

        },
        create: function(geekData){
            return $http.post('/api/geeks', geekData);
        }
        //eliminar una secj
        delete {

        }
    }
}]);