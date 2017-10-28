// =========================================================================
// =========================== Admin Controller ================================
// =========================================================================
app.controller('adminController', ['$scope', 'adminFactory', '$location', '$cookies', '$window', '$state', '$uibModal', function($scope, adminFactory, $location, $cookies, $window, $state, $uibModal){

  var $ctrl = this;

  if ($cookies.getObject('loggedAdmin')){
    $scope.loggedInAdmin = $cookies.getObject('loggedAdmin');
      getAllAdmin();
  } else{
    window.location.replace('/');
  };

  function getAllAdmin(){
    adminFactory.getAllAdmin(function(output){
      $scope.allOrgs = output.data;
    })
  };


// =-=-=-=-=-=-=-=-=-=-=-=- Modal -==-=-=-=-=-=-=-=-=-=
  $ctrl.open = function (orgId, orgName, size, parentSelector) {

    $ctrl.orgToRemove = {id :orgId, name: orgName};

    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.Delete-Organization ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'deleteOrgModal.html',
      controller: 'deleteOrgCtrl',
      controllerAs: '$ctrl',
      // size: size,
      appendTo: parentElem,
      resolve: {
        orgInfo: function () {
          return $ctrl.orgToRemove;
        }
      }
    });

    modalInstance.result.then(function (orgInfo) {
      // console.log(orgInfo);
      // Note: Possbily use old snack bar to show which org was just deleted
      getAllAdmin();
      }, function () {
    });

  };
// =-=-=-=-=-=-=-=-=-=- End Modal -==-=-=-=-=-=-=-=-=-=





  $ctrl.edit = function (orgId, orgName, email, phone, formattedAddress, size, parentSelector) {
    $ctrl.orgToEdit = {id :orgId, name: orgName, email: email, phone: phone, address: formattedAddress};

    var parentElem = parentSelector ?
      angular.element($document[0].querySelector('.Edit-Organization ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'editOrgModal.html',
      controller: 'editOrgModalCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      appendTo: parentElem,
      resolve: {
        orgInfo: function () {
          return $ctrl.orgToEdit;
        }
      }
    });

    modalInstance.result.then(function (orgInfo) {
      // console.log(orgInfo);

      getAllAdmin();
      }, function () {
    });

  };




}]); // End Controller








// =========================================================================
// ===================== deleteOrgCtrl Controller =======================
// =========================================================================
app.controller('deleteOrgCtrl', ['$scope', '$uibModalInstance', 'orgInfo', 'adminFactory', function ($scope, $uibModalInstance, orgInfo, adminFactory) {

  // var $ctrl = this;

  $scope.orgInfo = orgInfo;

  $scope.removeOrg = function () {
    adminFactory.deleteOrg(orgInfo, function(output){
      if(output.data == true){
        $uibModalInstance.close(orgInfo);
      } else {
        $scope.error2 = output.data;
      }
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // End deleteOrgCtrl Controller






// =========================================================================
// ===================== editOrgModalCtrl Controller =======================
// =========================================================================

app.controller('editOrgModalCtrl', ['$scope', '$uibModalInstance', '$scope', 'orgInfo', 'adminFactory', function ($scope, $uibModalInstance, $scope, orgInfo, adminFactory) {

  // var $ctrl = this;

  $scope.orgInfo = orgInfo;

  $scope.editOrgAdmin = function (isValid) {
    if(isValid){
      adminFactory.editOrgAdmin($scope.orgInfo, function(output){
        if(output.data.error){
          $scope.error2 = output.data.error;
        } else if (output.data == true){
          $uibModalInstance.close(orgInfo);
        }
      })
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // End editOrgModalCtrl Controller
