// =========================================================================
// =========================== LogReg Controller ================================
// =========================================================================
app.controller('logRegController', ['$scope', 'logRegFactory', '$location', '$cookies', '$window', function($scope, logRegFactory, $location, $cookies, $window){

  $scope.user = {};

// Register New User Method
  $scope.register = function(){
    // ===== Front End Validation ====
    if(!$scope.reg){
      $scope.error = 'Please enter your information to register';
    // } else if(!$scope.reg.email){
    //   $scope.error = 'Please enter an Email Address';
    } else if (!$scope.reg.street){
      $scope.error = 'Please enter the street of the organization to be registered';
    } else if (!$scope.reg.city){
      $scope.error = 'Please enter the city of the organization to be registered';
    // } else if(!$scope.reg.zip){
    //   $scope.error = 'Please enter a Zip code';
    } else {
      $scope.error = '';
      console.log('Sending to backend');
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
  };



  $scope.selectedAddress = function(address){
    console.log(address.formattedAddress);
    $scope.addressHolder = address;
    //-=-=-=-==-==-=-=-=-=-=-=-=-=-===-=-=-=-=-==-=-
    // Use this button to check if location is registered
    // If not, then prompt for Org name, email and password
    // Check email is not in system as well
    logRegFactory.verifyAddress($scope.addressHolder, function(output){
      console.log(output);
    })


  }





// -=-=-=-=-=-=-=-=-=-=-= Not Done -=-=-=-=-=-=-=-=-=-=-=
  // Login Method
  $scope.loginUser = function(){
    console.log($scope.login);
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
      console.log('sending to backend');
      // logRegFactory.login($scope.login, function(output){
      //   // console.log(output);
      //   // console.log('Back from factory --> finished login');
      //   if(output.data.error){
      //     $scope.error = output.data.error;
      //   } else {
      //     $cookies.putObject("loggedUser", output.data);
      //     $scope.user = $cookies.getObject('loggedUser');
      //     // $location.url('/');
      //     window.location.replace('/');
      //   }
      // })
    // $location.url('/logReg');
    // $scope.login = {};

    }
  }; // End Login Method
//-=-=-=-==-==-=-=-=-=-=-=-=-=-===-=-=-=-=-==-=-









}]); // End Controller
