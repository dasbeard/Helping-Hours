// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('editController', ['$scope', 'editFactory', '$location', '$cookies', '$window', function($scope, editFactory, $location, $cookies, $window){

  $scope.loggedInUser = $cookies.getObject('loggedUser')

  getOrganizationInfo();

  $scope.editOrganization = function(isValid){
    console.log('clickked');
  };









  function getOrganizationInfo(){
    editFactory.getOrgInfo($scope.loggedInUser, function(output){
      console.log(output);
      if(output.data.error){
        console.log('Error');
        console.log(output.data.error);
      } else {
        $scope.editOrg = output.data;
        // $scope.editOrg = $scope.Organization;
      }
    })
  };


}]); // End Controller
