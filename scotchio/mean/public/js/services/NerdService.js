/**
 * Created by alex on 21/08/2014.
 */
angular.module('NerdService', []).factory('Nerd', ['$http', function($http){
    return {
        //obtener todos
        get : function(){
            return $http.get('/api/nerds');
        },
        //crear por post
        create : function(nerdData){
            return $http.post('/api/nerds', nerdData);
        },
        delete : function(id){
            return $http.delete('/api/nerds/'+id);
        }
    }
}]);