// =========================================================================
// =========================== LogReg Controller ================================
// =========================================================================
app.controller('logRegController', ['$scope', 'logRegFactory', '$location', '$cookies', '$window', function($scope, logRegFactory, $location, $cookies, $window){

  $scope.user = {};


  $scope.register = function(){
    console.log('reg pressed');
    console.log($scope.reg);
    if($scope.reg){
      // Check if all fields are present
      if(!$scope.reg.email){
        $scope.error = 'Please enter a Email Address';
      }

    };
  };










}]); // End Controller
