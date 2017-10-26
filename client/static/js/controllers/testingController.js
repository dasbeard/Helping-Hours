// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('testingController', ['$scope', '$rootScope', 'logRegFactory', 'adminFactory', '$location', '$cookies', '$window', '$state', '$uibModal', function($scope, $rootScope, logRegFactory, adminFactory, $location, $cookies, $window, $state, $uibModal){

  var $lCtrl = this;

  $rootScope.loggedInUser = $cookies.getObject('loggedUser')

  $lCtrl.register = function (isValid, size, parentSelector) {
    // console.log($scope.reg);

    if(isValid){
      if(!$scope.reg){
        $scope.error = 'Please enter your information to register';
      } else if (!$scope.reg.street){
        $scope.error = 'Please enter the street of the organization to be registered';
      } else if (!$scope.reg.city){
        $scope.error = 'Please enter the city of the organization to be registered';
      } else if(!$scope.reg.zip){
        $scope.error = 'Please enter a Zip code';
      } else {
        $scope.error = '';

  // =-=-=-=-=-=-=-=-=-=-=-=- Modal -==-=-=-=-=-=-=-=-=-=
        logRegFactory.findLocation($scope.reg, function(output){
          if(output.error){
            $scope.error = output.error;
          } else {
            var allFound = output.data;

            var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.Location-Modal ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
              ariaDescribedBy: 'modal-body',
              templateUrl: 'yourLocationModal.html',
              controller: 'yourLocationCtrl',
              controllerAs: '$lCtrl',
              size: size,
              appendTo: parentElem,
              resolve: {
                allFound: function () {
                  return allFound;
                }
              }
            });

            modalInstance.result.then(function (locationResponse) {
              console.log(locationResponse);

              if(locationResponse == "LatLng"){
                latLngModal()
              }

              if(locationResponse.formattedAddress){
                var newOrg = orgModal(locationResponse)
              }




            }, function () {});

          }
        });
      }
    } // end isValid
  };
  // =-=-=-=-=-=-=-=-=-=- End Modal -==-=-=-=-=-=-=-=-=-=


  $scope.selectedAddress = function(address){
    // console.log(address.formattedAddress);
    $scope.newUser = {address: address};
    $scope.OrgNamePrompt = true;
  }; // End selectedAddress method

  $scope.latLngSubmit = function(isValid){
    if(isValid){
      if($scope.latLng){
        if(!$scope.latLng.lat){
          $scope.error2 = 'Latitude is Required';
        }
        else if(!$scope.latLng.lng){
          $scope.error2 = 'Longitude is Required';
        }
        else {
          logRegFactory.findLatLng($scope.latLng, function(output){
            // console.log(output.data);
            if(output.data.error){
              console.log(output.data.error);
              $scope.error = output.data.error;
            } else {
              $scope.error = '';
              $scope.foundLocations = output.data;
              $scope.latLngPromt = false;
              $scope.showLocationPicker = true;
              if(output.data.length > 1){
                $scope.locationHeading = 'Please Select Your Address';
                $scope.locationButton = 'Select';
              } else {
                $scope.locationHeading = 'Is This Your Address?';
                $scope.locationButton = 'Yes';
              }
            }
          })
        }
      }
    }
  }; // End latLng method

  // $scope.enterLatLong = function(){
  //   $scope.showLocationPicker = false;
  //   $scope.latLngPromt = true;
  // }; // End enterLatLong method

  $scope.openGoogleMaps = function() {
  		$window.open('http://www.maps.google.com', '_blank');
  	}; // End openGoogleMaps method

  // Login Method
  $scope.loginUser = function(){
    // console.log($scope.login);
    $scope.error = '';

    // ===== Front End Validation ====
    if (!$scope.login){
      $scope.error = 'Please Enter in Email and Password';
    } else if(!$scope.login.email){
      $scope.error = 'Email required to sign in';
    }else if (!$scope.login.password){
      $scope.error = 'Password required to sign in';
    } else {
      // Call Factory Method to Login
      $scope.error = '';
      // console.log('sending to backend');
      logRegFactory.login($scope.login, function(output){
        // console.log(output);
        if(output.data.error){
          $scope.error = output.data.error;
        } else {
          // console.log(output.data);
          setCookie(output.data);
          // $cookies.putObject("loggedUser", output.data);
          // $rootScope.loggedInUser = $cookies.getObject('loggedUser');
          window.location.replace('/#!/organization/' + $rootScope.loggedInUser.id);
        }
      });
    // $scope.login = {};

    }
  }; // End Login Method

  // Admin Login Method
  $scope.adminLogin = function(){
    // console.log($scope.admin);
    $scope.error = '';

    // ===== Front End Validation ====
    if (!$scope.admin){
      $scope.error = 'Please Enter in Email and Password';
    } else if(!$scope.admin.email){
      $scope.error = 'Email required to sign in';
    }else if (!$scope.admin.password){
      $scope.error = 'Password required to sign in';
    } else {
      // Call Factory Method to Login
      $scope.error = '';
      // console.log('sending to backend');
      adminFactory.loginAdmin($scope.admin, function(output){
        // adminFactory.log(output);
        if(output.data.error){
          $scope.error = output.data.error;
        } else {
          // console.log(output.data);
          setCookie(output.data, 'admin');
          window.location.replace('/#!/adminHome');
        }
      });
    }
  }; // End Admin Login Method

  $scope.adminPage = function(){
      window.location.replace('/#!/adminHome');
    }

  $scope.myPage = function(){
    window.location.replace('/#!/organization/' + $rootScope.loggedInUser.id);
  }

  $scope.logoutUser = function(){
    // console.log('button clicked');
    $cookies.remove('loggedUser');
    $cookies.remove('loggedAdmin');

    window.location.replace('/');
  } // End logoutUser method

  $scope.isNavCollapsed = true;
  $scope.isCollapsed = false;
  $scope.isCollapsedHorizontal = false;

  function setCookie(input, admin){
    var expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + .5);

    if(admin){
      $cookies.putObject("loggedAdmin", input, {expires: expireAt});
      $rootScope.loggedInAdmin = $cookies.getObject('loggedAdmin');
    } else {
      $cookies.putObject("loggedUser", input, {expires: expireAt});
      $rootScope.loggedInUser = $cookies.getObject('loggedUser');
    }

  };


  // $scope.openLatLng = function(){
  //   latLngModal();
  // }
  //
  // $scope.openOrg = function(){
  //   orgModal();
  // }



  function orgModal(locationResponse, parentSelector){
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.Organization-Modal ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'organizationModal.html',
      controller: 'organizationCtrl',
      // controllerAs: '$oCtrl',
      // size: size,
      appendTo: parentElem,
      resolve: {
        location: function () {
          return locationResponse;
        }
      }
    });

    modalInstance.result.then(function (response) {
      // console.log(response);
      setCookie(response.sentback);
      window.location.replace('/#!/edit');
    }, function () {
      });
  }


  function latLngModal(parentSelector, input){
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.LatLng-Modal ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'latLngModal.html',
      controller: 'LatLngCtrl',
      controllerAs: '$llCtrl',
      size: 'lg',
      appendTo: parentElem,
      resolve: {
        // location: function () {
        //   return locationResponse;
        // }
      }
    });

    modalInstance.result.then(function (response) {
      orgModal(response);
      // setCookie(response.sentback);
      // window.location.replace('/#!/edit');
    }, function () {
      });
  }





}]); // End Controller


// =========================================================================
// ===================== yourLocationCtrl Controller =======================
// =========================================================================
app.controller('yourLocationCtrl', ['$scope', '$uibModalInstance', 'allFound', 'logRegFactory', function ($scope, $uibModalInstance, allFound, logRegFactory) {

  $scope.allFound = allFound;

  if($scope.allFound.length > 1){
    $scope.locationHeading = 'Please Select Your Address';
    $scope.locationButton = 'Select';
  } else {
    $scope.locationHeading = 'Is This Your Address?';
    $scope.locationButton = 'Yes';
  }

  $scope.selectedAddress = function(selectedInput) {
    // console.log(selectedInput);
    $uibModalInstance.close(selectedInput);
  };

  $scope.enterLatLong = function(){

    $uibModalInstance.close('LatLng');
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // End yourLocationCtrl Controller


// =========================================================================
// ===================== organizationCtrl Controller =======================
// =========================================================================
app.controller('organizationCtrl', ['$scope', '$uibModalInstance', 'location', 'logRegFactory', function ($scope, $uibModalInstance, location, logRegFactory) {

  $scope.confirmPassword = function(isValid) {
    // console.log(isValid);
    if(isValid){
      $scope.reg2.address = location;
      // console.log($scope.reg2);
      logRegFactory.newRegistration($scope.reg2, function(output){
        // console.log(output.data);
        if(output.data.error){
          $scope.error2 = output.data.error;
        } else {
          var response = output.data;

          $uibModalInstance.close(response);
        }
      });
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]); // End organizationCtrl Controller



// =========================================================================
// ===================== LatLngCtrl Controller =======================
// =========================================================================
app.controller('LatLngCtrl', ['$scope', '$uibModalInstance', 'logRegFactory', '$window', function ($scope, $uibModalInstance, logRegFactory, $window) {

  $scope.latLngSubmit = function(isValid) {
    // console.log(isValid);
    if(isValid){
      // console.log($scope.latLng);
      logRegFactory.findLatLng($scope.latLng, function(output){
        // console.log(output.data);
        if(output.data.error){
          console.log(output.data.error);
          $scope.error = output.data.error;
        } else {
          // console.log(output.data[0]);
          $uibModalInstance.close(output.data[0]);
        }
      });
    }

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.openGoogleMaps = function() {
  		$window.open('http://www.maps.google.com', '_blank');
  	}; // End openGoogleMaps method

}]); // End organizationCtrl Controller
