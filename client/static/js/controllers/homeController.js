// =========================================================================
// =========================== Home Controller ================================
// =========================================================================
app.controller('homeController', ['$scope', 'homeFactory', '$location', '$cookies', '$window', 'NgMap', '$state', '$timeout', function($scope, homeFactory, $location, $cookies, $window, NgMap, $state, $timeout){

  $scope.loadingOrgs = true;

  getAllOrgs();

  var vm = this;
  NgMap.getMap({id: 'mapId'}).then(function(map) {
       // Try HTML5 geolocation.
  google.maps.event.trigger(map, 'resize')

      if (navigator.geolocation) {
        // var infowindow = new google.maps.InfoWindow({map: map});
        if($cookies.getObject('currentUserPosition')){
          var pos = $cookies.getObject('currentUserPosition');
          var userLocationIcon = "assets/locationPinSmall.png";
          var userLocation = new google.maps.Marker({
            position: pos,
            animation: google.maps.Animation.DROP,
            map: map,
            icon: userLocationIcon
          });
          map.setCenter(pos);
          map.setZoom(12);
          getNearBy(pos);

        } else if(!$cookies.getObject('currentUserPosition')){


        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 8
          };
          var today = new Date;
          today.setDate(today.getDate() + 2);          $cookies.putObject("currentUserPosition", pos, [today]);

          var userLocationIcon = "assets/locationPinSmall.png";
          var userLocation = new google.maps.Marker({
            position: pos,
            animation: google.maps.Animation.DROP,
            map: map,
            icon: userLocationIcon
          });
          map.setCenter(pos);
          map.setZoom(10);

      // Gets all orgs nearby for Accordian
          getNearBy(pos);

      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

          },
            function() {
            handleLocationError(true, infowindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infowindow, map.getCenter());
        }
      }
      function handleLocationError(browserHasGeolocation, infowindow, pos) {
        map.setPosition(pos);
        map.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
      };
      // =-=-=-=-=-=-=-=-=-=~~~~~ End get Geo Location ~~~~~=-=-=-=-=-=-=-=-=-=

        vm.map = map;
  });




  // =-=-=-=-=-=-=-=-=-=~~~~~ Accordion ~~~~~=-=-=-=-=-=-=-=-=-=
  $scope.oneAtATime = true;

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };


  function getNearBy(pos){
    homeFactory.getNearBy(pos, function(output){
      if(!output.error){
        $scope.within2miles = output.data.within2miles;
        $scope.within5miles = output.data.within5miles;
        $scope.within25miles = output.data.within25miles;
        $scope.loadingOrgs = false;
      }
    })
  };



  // =-=-=-=-=-=-=-=-=-=~~~~~ End Accordion ~~~~~=-=-=-=-=-=-=-=-=-=

  $scope.visitOrg = function(orgId) {
    $state.go('organization', {id: orgId});
  };


  function getAllOrgs(){
    homeFactory.findAllOrgs(function(output){
      vm.orgs = output.data;
      vm.org = vm.orgs[0];
    })
  };


// =-=-=-=-=-=-=-=-~~~ Map Marker Functions ~~~=-=-=-=-=-=-=-=-
  vm.showDetail = function(e, org) {
    vm.org = org;
    vm.map.showInfoWindow('orgInfoWindow', org.organization);
  };

  $scope.openWebsite = function (website){
    var site = 'http://';
    site += website;
    $window.open(site);
  }

  $scope.openMap = function (position){
    var site = 'https://www.google.com/maps/dir/?api=1&destination=';
    site += encodeURI(position);
    $window.open(site);
  }

  vm.goToOrg = function(orgId) {
    $state.go('organization', {id: orgId});
  };

  $scope.goToOrgSearch = function(orgId) {
    // console.log(orgId);
    $state.go('organization', {id: orgId});
  };

  // =-=-=-=-=-=-=-=-~~~ End Map Marker Functions ~~~=-=-=-=-=-=-=-=-









  // =-=-=-=-=-=-=-=-~~~ City Search Functions ~~~=-=-=-=-=-=-=-=-



  $scope.citySearch = function(){
    $scope.searchBy = {city: $scope.city, state: $scope.state};
    $scope.noLocations = '';
    $scope.searchedCity = {};
    homeFactory.citySearch($scope.searchBy, function(output){
      if (output.data.error){
        $scope.noLocations = "No Locations Found";
      } else {
        // console.log(output.data);
        $scope.searchedCity = output.data;
      }
    });

  } // End citySearch




  $scope.copyEmail = function(){
    $scope.copied = 1;
    $timeout(function() {
      $scope.copied = 0;
    }, 2800);
  };















}]); // End Controller
