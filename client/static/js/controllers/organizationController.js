// =========================================================================
// =========================== Organization Controller ===========================
// =========================================================================
app.controller('organizationController', ['$scope', 'editFactory', '$location', '$cookies', '$window', '$uibModal', '$log', '$document', '$stateParams', function($scope, editFactory, $location, $cookies, $window, $uibModal, $log, $document, $stateParams){

  $scope.loggedInUser = $cookies.getObject('loggedUser');


  $scope.findOrg = $stateParams;

  editFactory.getOrgInfo($scope.findOrg, function(output){
    if(output.data.error){
      console.log('Error');
      console.log(output.data.error);
    } else {
      $scope.org = output.data;
      $scope.orgServices = output.data.services;
      $scope.isAvailable = {};
      if(output.data.contactEmail){
        $scope.isAvailable.email = true;
      }
      if(output.data.website){
        $scope.isAvailable.website = true;
      }
      if(output.data.phone){
        $scope.isAvailable.phone = true;
        $scope.org.phone = phoneDisplay(output.data.phone);
      }
      $scope.loggedInUser = $cookies.getObject('loggedUser');
    }
  });













  $scope.openWebsite = function (){
    var site = 'http://'
    site += $scope.org.website
    $window.open(site);
  }



  function phoneDisplay(str){
    if (str.length == 10){
      return '(' + str.substr(0,3) + ')' + str.substr(3,3) + '-' + str.substr(6);
    } else {
      return str.substr(0,1) + '(' + str.substr(1,3) + ')' + str.substr(4,3) + '-' + str.substr(7);
    }
  };


}]); // End Controller
