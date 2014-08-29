/**
 * Created by alex on 21/08/2014.
 * Se conecta con los servicios del back end
 */
angular.module('GeekService', []).factory('Geek', ['$http', function($http){

    return {
        //get all para obtener el resultado
        get: function(){
            return $http.get('/api/geeks');
        },
        //llamar al post y crear un nuevo Geek
        create: function(geekData){
            return $http.post('/api/geeks', geekData);
        },
        //eliminar una geek
        delete: function(id) {
            return $http.delete('/api/geeks/'+id);
        }
    }
}]);