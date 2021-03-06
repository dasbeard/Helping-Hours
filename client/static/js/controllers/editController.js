// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('editController', ['$scope', 'editFactory', '$location', '$cookies', '$window', '$uibModal', '$log', '$document', function($scope, editFactory, $location, $cookies, $window, $uibModal, $log, $document){


  // console.log($scope.loggedInUser);
  if ($cookies.getObject('loggedUser')){
    $scope.loggedInUser = $cookies.getObject('loggedUser');
    getOrganizationInfo();
  } else{
    window.location.replace('/');
  };


  // console.log($scope.loggedInUser);


  $scope.editOrganization = function(isValid){
    // console.log($scope.editOrg);
    var checkboxServices = {};
    $scope.error = '';

    if ($scope.editOrgServices){
      if ($scope.editOrgServices.beds == true){
        checkboxServices.beds = true;
      } else {
        checkboxServices.beds = false;
      }
      if ($scope.editOrgServices.cloths == true){
        checkboxServices.cloths = true;
      } else {
        checkboxServices.cloths = false;
      }
      if ($scope.editOrgServices.education == true){
        checkboxServices.education = true;
      } else {
        checkboxServices.education = false;
      }
      if ($scope.editOrgServices.interview == true){
        checkboxServices.interview = true;
      } else {
        checkboxServices.interview = false;
      }
      if ($scope.editOrgServices.job == true){
        checkboxServices.job = true;
      } else {
        checkboxServices.job = false;
      }
      if ($scope.editOrgServices.childCare == true){
        checkboxServices.childCare = true;
      } else {
        checkboxServices.childCare = false;
      }
      if ($scope.editOrgServices.recActivites == true){
        checkboxServices.recActivites = true;
      } else {
        checkboxServices.recActivites = false;
      }
      if ($scope.editOrgServices.donations == true){
        checkboxServices.donations = true;
      } else {
        checkboxServices.donations = false;
      }
      if ($scope.editOrgServices.otherServices){
        checkboxServices.otherServices = $scope.editOrgServices.otherServices;
      } else {
        checkboxServices.otherServices = '';
      }
    }
    else {
      checkboxServices.beds = false;
      checkboxServices.cloths = false;
      checkboxServices.education = false;
      checkboxServices.interview = false;
      checkboxServices.job = false;
      checkboxServices.childCare = false;
      checkboxServices.recActivities = false;
      checkboxServices.donations = false;
      checkboxServices.otherServices = '';
    };

    var services = {};

    if($scope.editOrg.website){
      services.website = $scope.editOrg.website;
    };
    if($scope.editOrg.contactEmail){
      services.contactEmail = $scope.editOrg.contactEmail;
    };
    if($scope.editOrg.phone){
      services.phone = $scope.editOrg.phone;
    };
    if($scope.editOrg.description){
      services.description = $scope.editOrg.description;
    } else{
      services.description = '';
    };
    services.checkboxes = checkboxServices;
    services.id = $scope.loggedInUser.id;

    // console.log(services);
    editFactory.updateServices(services, function(output){
      if(output.data.error){
        $scope.error = output.data.error;
        clearError();
// =-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-
              // Error message containing response
// =-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-
      } else if(output.data == true) {
        getOrganizationInfo();
        $scope.savedMask = true;
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.savedMask = false;
            });
            window.location.replace('/#!/organization/' + $scope.loggedInUser.id);
        }, 1000);
        // window.location.replace('/#!/organization/' + $scope.loggedInUser.id);

      }
    })
  }; // End editOrganization





  $scope.addDay2 = function(input){
    var toSend = {id: $scope.loggedInUser.id, input: input};
    // console.log(toSend);

    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'HoursOfOpModal.html',
      controller: 'HoursOfOpCtrl',
      size: 'lg',
      resolve: {
        typeOfDay: function () {
          return toSend;
        }
      }
    });

    modalInstance.result.then(function (response) {
        getOrganizationInfo();

    }, function () {});
  };

  $scope.removeDay = function(idx, service){
    var toRemove = {id: $scope.loggedInUser.id, index: idx, service: service};
    editFactory.removeDay(toRemove, function(output){
      if(output.data.error){
        $scope.error = output.error;

        // Error message containing response
      } else {
        getOrganizationInfo()
      }
    })
  };

  function getOrganizationInfo(){
    editFactory.getOrgInfo($scope.loggedInUser, function(output){
      if(output.data.error){
        console.log('Error');
        console.log(output.data.error);
        $scope.error = output.data.error;
      } else {
        $scope.editOrg = output.data;
        $scope.editOrgServices = output.data.services;
        $scope.isAvailable = {};
        if(output.data.contactEmail){
          $scope.isAvailable.email = true;
        }
        if(output.data.website){
          $scope.isAvailable.website = true;
        }
        if(output.data.phone){
          $scope.isAvailable.phone = true;
        }
        $scope.loggedInUser = $cookies.getObject('loggedUser');
      }
    })
    // console.log('saved');
  };




  function clearError(){
    setTimeout(function () {
        $scope.$apply(function () {
            $scope.error = false;
        });
    }, 5000);
  };

}]); // End Controller



// =========================================================================
// ===================== HoursOfOpCtrl Controller =======================
// =========================================================================
app.controller('HoursOfOpCtrl', ['$scope', '$uibModalInstance', 'editFactory', 'typeOfDay', function ($scope, $uibModalInstance, editFactory, typeOfDay) {

  $scope.open = '2017-10-26T07:00:43.000Z';
  $scope.close = $scope.open;

  if(typeOfDay == 'HOP'){
    $scope.modalTitle = 'When are you Open?';
  } else {
    $scope.modalTitle = 'When are you Serving Food?';
  };


  $scope.add = function() {
    var daysToAdd = [];
    for(i=0; i<$scope.days.length; i++){
      if($scope.days[i].isSelected == true){
        $scope.days[i].open = $scope.open;
        $scope.days[i].close = $scope.close;
        daysToAdd.push($scope.days[i]);
      }
    }
    var sendToDB = {id:typeOfDay.id, type: typeOfDay.input, days: daysToAdd};
    editFactory.addDay(sendToDB, function(output){
      if(output.data == 'error'){
        $scope.error = output.error;
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.error = false;
            });
        }, 5000);
      } else {
        $uibModalInstance.close(true);
      }
    });



  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // End HoursOfOpCtrl Controller
