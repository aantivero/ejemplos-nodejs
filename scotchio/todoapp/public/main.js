/*
 * Modulo Main, definir el modulo, el controller y las funciones para manejar 
 * las llamadas al api de tareas
 */

var tareaApp = angular.module('tareaApp', []);
function mainController($scope, $http){
    $scope.formData = {};
    
    //al cargar la pagina trae todas las tareas y luego las muestra
    $http.get('/api/tareas')
        .success(function(data) {
            $scope.tareas = data;
            console.log(data);
        })
        .error(function(data) {
           console.log('Error ' + data); 
        });
        
    //crear una tarea y enviar los datos al api
    $scope.crearTarea = function() {
      $http.post('/api/tareas', $scope.formData)
        .success(function(data){
           $scope.formData = {};//limpiar los datos del formulario
           $scope.tareas = data;
           console.log(data);
        })
        .error(function(data){
            console.log('Error al crear Tarea ' + data);
        });
    };
    
    $scope.borrarTarea = function(id) {
        $http.delete('/api/tareas/'+id)
                .success(function(data){
                    $scope.tareas = data;
                    console.log(data);
        }).error(function(data){
            console.log('Error al borrar Tarea ' + data);
        });
    };
}