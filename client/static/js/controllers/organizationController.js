// =========================================================================
// =========================== Organization Controller ===========================
// =========================================================================
app.controller('organizationController', ['$scope', 'editFactory', '$location', '$cookies', '$window', 'NgMap', '$stateParams', '$timeout', function($scope, editFactory, $location, $cookies, $window, NgMap, $stateParams, $timeout){


  $scope.daysStatus = false;
  $scope.noOrgInfo = false;


  $scope.findOrg = $stateParams;

  if($scope.loggedInUser = $cookies.getObject('loggedUser')){
    if($scope.loggedInUser.id == $scope.findOrg.id){
      $scope.loggedOrg = true;
    } else {
      $scope.loggedOrg = false;
    }
  };


  editFactory.getOrgInfo($scope.findOrg, function(output){
    if(output.data.error){
      console.log('Error');
      console.log(output.data.error);
    } else {
      $scope.org = output.data;
      $scope.orgServices = output.data.services;
      $scope.latLong = output.data.lat + ',' + output.data.lng;


      if(($scope.org.daysServingFood.length < 1) && ($scope.org.hoursOfOperation.length < 1)){
        $scope.daysStatus = true;
      }

      if(!$scope.org.contactEmail && !$scope.org.phone && !$scope.org.website){
        $scope.noOrgInfo = true;
      }

      if(output.data.phone){
        $scope.org.phone = phoneDisplay(output.data.phone);
      }



      // $scope.loggedInUser = $cookies.getObject('loggedUser');

      NgMap.getMap().then(function(map) {
          var marker = new google.maps.Marker({
            position: {lat: $scope.org.lat, lng: $scope.org.lng},
            map: map,
            clickable: false,
            animation: google.maps.Animation.DROP,
          })
      });


    }
  });





  $scope.copyEmail = function(){
    $scope.copied = 1;
    $timeout(function() {
      $scope.copied = 0;
    }, 2800);
  };

  $scope.openWebsite = function (){
    var site = 'http://'
    site += $scope.org.website
    $window.open(site);
  };

  $scope.openMap = function (){
    var site = 'https://www.google.com/maps/dir/?api=1&destination=';
    site += encodeURI($scope.org.formattedAddress);
    $window.open(site);
  };

  function phoneDisplay(str){
    if (str.length == 10){
      return '(' + str.substr(0,3) + ')' + str.substr(3,3) + '-' + str.substr(6);
    } else {
      return str.substr(0,1) + '(' + str.substr(1,3) + ')' + str.substr(4,3) + '-' + str.substr(7);
    }
  };


}]); // End Controller
