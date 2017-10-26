// =========================================================================
// =========================== LogReg Controller ===========================
// =========================================================================
app.controller('logRegController', ['$scope', '$rootScope', 'logRegFactory', 'adminFactory', '$location', '$cookies', '$window', '$state', function($scope, $rootScope, logRegFactory, adminFactory, $location, $cookies, $window, $state){


  $rootScope.loggedInUser = $cookies.getObject('loggedUser')



// Register New User Method
  $scope.register = function(isValid){
    if(isValid){
    // ===== Front End Validation ====
      if(!$scope.reg){
        $scope.error = 'Please enter your information to register';
      } else if (!$scope.reg.street){
        $scope.error = 'Please enter the street of the organization to be registered';
      } else if (!$scope.reg.city){
        $scope.error = 'Please enter the city of the organization to be registered';
      // } else if(!$scope.reg.zip){
      //   $scope.error = 'Please enter a Zip code';
      } else {
        $scope.error = '';
        // console.log('Sending to backend');
        logRegFactory.findLocation($scope.reg, function(output){
          // console.log(output);
          if(output.data.error){
            $scope.error = output.data.error;
          } else {
            $scope.foundLocations = output.data;
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
    } else {
      console.log('not valid');
    }
  }; // End register method



  $scope.selectedAddress = function(address){
    // console.log(address.formattedAddress);
    $scope.newUser = {address: address};
    $scope.OrgNamePrompt = true;
  }; // End selectedAddress method



  $scope.confirmPassword = function(isValid){
    // console.log(isValid);
    if(isValid){
      if($scope.reg2){
        if(!$scope.reg2.orgName){
          $scope.error2 = 'An Organization Name is Required';
        } else if(!$scope.reg2.email){
          $scope.error2 = 'An E-Mail Address is Required';
        } else if(!$scope.reg2.password){
          $scope.error2 = 'A Password is Required';
        } else if(!$scope.reg2.passwordConf){
          $scope.error2 = 'Please Verify your Password';
        }  else if($scope.reg2.password != $scope.reg2.passwordConf){
          $scope.error2 = 'Passwords do not match!';
        } else {
          $scope.error2 = '';
          $scope.newUser.orgName = $scope.reg2.orgName;
          $scope.newUser.email = $scope.reg2.email;
          $scope.newUser.password = $scope.reg2.password;
          // Send to backend to register new user
          logRegFactory.newRegistration($scope.newUser, function(output){
            // console.log(output.data);
            if(output.data.error){
              $scope.error2 = output.data.error;
            } else {
              setCookie(output.data.sentback);
              // $cookies.putObject("loggedUser", output.data.sentback);
              // $rootScope.loggedInUser = $cookies.getObject('loggedUser');
              window.location.replace('/#!/edit');
            }
          });
        }
      } else {
        $scope.error2 = 'Please Enter Information';
      }
    }
  }; //End confirmPassword method



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




  $scope.enterLatLong = function(){
    $scope.showLocationPicker = false;
    $scope.latLngPromt = true;
  }; // End enterLatLong method



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







}]); // End Controller
