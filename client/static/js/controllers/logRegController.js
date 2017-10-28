// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('logRegController', ['$scope', '$rootScope', 'logRegFactory', 'adminFactory', '$location', '$cookies', '$window', '$state', '$uibModal', function($scope, $rootScope, logRegFactory, adminFactory, $location, $cookies, $window, $state, $uibModal){

  $rootScope.loggedInUser = $cookies.getObject('loggedUser');
  $rootScope.loggedInAdmin = $cookies.getObject('loggedAdmin');




  $scope.register = function (isValid, size, parentSelector) {
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
              // controllerAs: '$lCtrl',
              size: size,
              appendTo: parentElem,
              resolve: {
                allFound: function () {
                  return allFound;
                }, function () {}
              }
            });

            modalInstance.result.then(function (locationResponse) {
              // console.log(locationResponse);

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
    } else if(!isValid){
      $scope.error = 'All fields are required to Register';
      clearError();
    };
  };
  // =-=-=-=-=-=-=-=-=-=- End Modal -==-=-=-=-=-=-=-=-=-=


  $scope.closeAlert = function(){
    $scope.error= '';
  };


  // Login Method
  $scope.loginUser = function(){
    // console.log($scope.login);
    $scope.error = '';
    // ===== Front End Validation ====
    if (!$scope.login){
      $scope.error = 'Please Enter in Email and Password';
      clearError();
    } else if(!$scope.login.email){
      $scope.error = 'Email required to sign in';
      clearError();
    }else if (!$scope.login.password){
      $scope.error = 'Password required to sign in';
      clearError();
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
  $scope.adminLogin = function(isValid){
    // console.log($scope.admin);
    $scope.error = '';
    if(isValid){
      // ===== Front End Validation ====
      if (!$scope.admin){
        $scope.error = 'Please Enter in Email and Password';
        clearError();
      } else if(!$scope.admin.email){
        $scope.error = 'Email required to sign in';
        clearError();
      }else if (!$scope.admin.password){
        $scope.error = 'Password required to sign in';
      } else {
        clearError();
        // Call Factory Method to Login
        $scope.error = '';
        // console.log('sending to backend');
        adminFactory.loginAdmin($scope.admin, function(output){
          // adminFactory.log(output);
          if(output.data.error){
            $scope.error = output.data.error;
            clearError();
          } else {
            // console.log(output.data);
            setCookie(output.data, 'admin');
            window.location.replace('/#!/adminHome');
          }
        });
      }
    } else {
      $scope.error = "All fields are required";
      clearError();
    }
  }; // End Admin Login Method

  $scope.myPage = function(){
    window.location.replace('/#!/organization/' + $rootScope.loggedInUser.id);
  }

  $scope.logoutUser = function(){
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

  function orgModal(locationResponse, parentSelector){
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.Organization-Modal ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'organizationModal.html',
      controller: 'organizationCtrl',
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
  };


  function latLngModal(parentSelector, input){
    var parentElem = parentSelector ?
    angular.element($document[0].querySelector('.LatLng-Modal ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      ariaDescribedBy: 'modal-body',
      templateUrl: 'latLngModal.html',
      controller: 'LatLngCtrl',
      size: 'lg',
      appendTo: parentElem,
      resolve: {}
    });

    modalInstance.result.then(function (response) {
      orgModal(response);
    }, function () {
      });
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
    if(isValid){
      $scope.reg2.address = location;
      logRegFactory.newRegistration($scope.reg2, function(output){
        if(output.data.error){
          $scope.error2 = output.data.error;
        } else {
          var response = output.data;

          $uibModalInstance.close(response);
        }
      });
    } else {
      $scope.error2 = "All fields are required";
      setTimeout(function () {
          $scope.$apply(function () {
              $scope.error2 = false;
          });
      }, 5000);
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.closeAlert = function(){
    $scope.error2= '';
  };

}]); // End organizationCtrl Controller



// =========================================================================
// ===================== LatLngCtrl Controller =======================
// =========================================================================
app.controller('LatLngCtrl', ['$scope', '$uibModalInstance', 'logRegFactory', '$window', function ($scope, $uibModalInstance, logRegFactory, $window) {

  $scope.latLngSubmit = function(isValid) {
    if(isValid){
      // console.log($scope.latLng);
      logRegFactory.findLatLng($scope.latLng, function(output){
        // console.log(output);
        if(output.data.error){
          $scope.error2 = output.data.error;
          setTimeout(function () {
              $scope.$apply(function () {
                  $scope.error2 = '';
              });
          }, 5000);
        } else {
          $uibModalInstance.close(output.data[0]);
        }
      });
    } else {
      $scope.error2 = "Both Latitude and Longitude are required";
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.openGoogleMaps = function() {
  		$window.open('http://www.maps.google.com', '_blank');
  	};


  $scope.closeAlert = function(){
    $scope.error2= '';
  };


}]); // End organizationCtrl Controller
