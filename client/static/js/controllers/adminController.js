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
      // console.log($scope.allOrgs);
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
      console.log(orgInfo);
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
app.controller('deleteOrgCtrl', ['$uibModalInstance', 'orgInfo', 'adminFactory', function ($uibModalInstance, orgInfo, adminFactory) {

  var $ctrl = this;

  $ctrl.orgInfo = orgInfo;

  $ctrl.removeOrg = function () {
    adminFactory.deleteOrg(orgInfo, function(output){
      if(output.data == true){
        $uibModalInstance.close(orgInfo);
      } else {
        $scope.error = output.data;
        // Error message Here

      }
    })
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // End deleteOrgCtrl Controller






// =========================================================================
// ===================== editOrgModalCtrl Controller =======================
// =========================================================================

app.controller('editOrgModalCtrl', ['$uibModalInstance', '$scope', 'orgInfo', 'adminFactory', function ($uibModalInstance, $scope, orgInfo, adminFactory) {

  var $ctrl = this;

  // adminFactory.editOrgAdmin(orgInfo, function(output){
  //   console.log(output);
  //   $ctrl.thisOrg = output.data;
  // })


  $ctrl.orgInfo = orgInfo;



  $ctrl.editOrgAdmin = function (isValid) {
    if(isValid){
      adminFactory.editOrgAdmin($ctrl.orgInfo, function(output){
        if(output.data.error){
          // Error message Here
        } else if (output.data == true){

          $uibModalInstance.close(orgInfo);
        }
      })
    }

  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

}]); // End editOrgModalCtrl Controller
