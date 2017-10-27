// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('testingController', ['$scope', '$rootScope', 'logRegFactory', 'adminFactory', '$location', '$cookies', '$window', '$state', '$uibModal', function($scope, $rootScope, logRegFactory, adminFactory, $location, $cookies, $window, $state, $uibModal){

  $scope.open = '2017-04-23T07:00:43.000Z';
  $scope.close = $scope.open;


  $scope.getTime = function(){
    // console.log($scope.days);
    var daysToAdd = [];
    for(i=0; i<$scope.days.length; i++){
      if($scope.days[i].isSelected == true){
        $scope.days[i].open = $scope.open;
        $scope.days[i].close = $scope.close;
        daysToAdd.push($scope.days[i]);
      }
    }
    console.log($scope.days);
    $scope.daysToAdd = daysToAdd;
}

}]); // End Controller
