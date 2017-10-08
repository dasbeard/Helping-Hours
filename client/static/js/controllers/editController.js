// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('editController', ['$scope', 'editFactory', '$location', '$cookies', '$window', '$uibModal', '$log', '$document', function($scope, editFactory, $location, $cookies, $window, $uibModal, $log, $document){


  $scope.loggedInUser = $cookies.getObject('loggedUser');

  getOrganizationInfo();

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
        }, 2100);
        // window.location.replace('/#!/edit');

      }
    })
  }; // End editOrganization









  $scope.addDay = function(isValid, service){
    $scope.hoursOfOpFormInvalid = false;
    if(!isValid){
      $scope.hoursOfOpFormInvalid = true;
    } else {
      if(service == 'hoursOfOperation'){
        if(($scope.hoursOfOp.open > $scope.hoursOfOp.closed) && ($scope.hoursOfOp.openPeriod == $scope.hoursOfOp.closedPeriod)){
          // console.log('not valid');
          $scope.hoursOfOpFormInvalid2 = true;
        } else {
          $scope.hoursOfOp.id = $scope.loggedInUser.id;
          $scope.hoursOfOp.service = service;

          editFactory.addDay($scope.hoursOfOp, function(output){
            if(output.data.error){
// =-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-
              // Error message containing response
// =-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=--=-
            } else {
              getOrganizationInfo()
              $scope.hoursOfOpMask = false;
            }
          })
        }
      } else if (service == 'daysServingFood'){
        if(($scope.servingFood.open > $scope.servingFood.closed) && ($scope.servingFood.openPeriod == $scope.servingFood.closedPeriod)){
          $scope.hoursOfOpFormInvalid2 = true;
        } else {
          $scope.servingFood.id = $scope.loggedInUser.id;
          $scope.servingFood.service = service;

          editFactory.addDay($scope.servingFood, function(output){
            if(output.data.error){
              // Error message containing response
            } else {
              getOrganizationInfo()
              $scope.servingFoodMask = false;
            }
          })
        }
      }
    }
  };



  $scope.removeDay = function(idx, service){
    var toRemove = {id: $scope.loggedInUser.id, index: idx, service: service};
    editFactory.removeDay(toRemove, function(output){
      if(output.data.error){
        // Error message containing response
      } else {
        getOrganizationInfo()
      }
    })
  };


  $scope.addDayOfOp = function(){
    $scope.hoursOfOpMask = true;
  };


  $scope.addServing = function(){
    $scope.servingFoodMask = true;
  };







  $scope.closeMask = function() {
    $scope.hoursOfOpMask = false;
    $scope.servingFoodMask = false;
    $scope.hoursOfOpFormInvalid = false;
    $scope.hoursOfOpFormInvalid2 = false;
    $scope.servingFoodFormInvalid = false;
    $scope.servingFoodFormInvalid2 = false;
  };



  function getOrganizationInfo(){
    editFactory.getOrgInfo($scope.loggedInUser, function(output){
      if(output.data.error){
        console.log('Error');
        console.log(output.data.error);
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






  $scope.open = function () {
    $scope.savedMask = true;
    setTimeout(function () {
        $scope.$apply(function () {
            $scope.savedMask = false;
        });
    }, 2000);
  }









}]); // End Controller
