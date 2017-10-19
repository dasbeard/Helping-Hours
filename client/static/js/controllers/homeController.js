// =========================================================================
// =========================== Home Controller ================================
// =========================================================================
app.controller('homeController', ['$scope', 'homeFactory', '$location', '$cookies', '$window', 'NgMap', '$state', function($scope, homeFactory, $location, $cookies, $window, NgMap, $state){

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





}]); // End Controller











// ~~~~~===================~~~~~ Old Methods ~~~~~===================~~~~~

  // $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyBN4DR6_NEex4E0iFmkgDgqANrO69pCgtM";

    // =============== Google Maps ===============
  // NgMap.getMap().then(function(map) {
  //    // Try HTML5 geolocation.
  //
  //   if (navigator.geolocation) {
  //     // var infowindow = new google.maps.InfoWindow({map: map});
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //         zoom: 8
  //       };
  //       var userLocationIcon = "assets/locationPinSmall.png";
  //       var userLocation = new google.maps.Marker({
  //         position: pos,
  //         animation: google.maps.Animation.DROP,
  //         map: map,
  //         icon: userLocationIcon
  //       });
  //       map.setCenter(pos);
  //       map.setZoom(12);
  //
  //       getNearby(pos);
  //     },
  //       function() {
  //       handleLocationError(true, infowindow, map.getCenter());
  //     });
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infowindow, map.getCenter());
  //   }
  //
  //   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //     map.setPosition(pos);
  //     map.setContent(browserHasGeolocation ?
  //       'Error: The Geolocation service failed.' :
  //       'Error: Your browser doesn\'t support geolocation.');
  //   };
  //
  //   getAllOrgs()
  //
  //
  //
  //   function drop() {
  //     for (var i =0; i < markerArray.length; i++) {
  //       setTimeout(function() {
  //         addMarkerMethod();
  //       }, i * 100);
  //     }
  //   }
  //
  //   function getAllOrgs(){
  //     logRegFactory.getAll(function(output){
  //       // Need Error checking
  //
  //       var orgNames =[];
  //       // var orgDescrips = [];
  //       for (var i=0; i<output.data.length; i++){
  //         orgNames.push('<a href="#!/showPage/' + output.data[i]._id+ '">' + output.data[i].organization + '<br>' + output.data[i].address + '</a>');
  //         // orgNames.push(output.data[i].description);
  //       };
  //
  //       $scope.nearbyOrgs = output.data;
  //       // console.log($scope.nearbyOrgs);
  //
  //       for (var i=0; i<output.data.length; i++){
  //         var marker = new google.maps.Marker({
  //           position: {lat: output.data[i].latitude, lng: output.data[i].longitude},
  //           map: map,
  //           clickable: true,
  //           animation: google.maps.Animation.DROP,
  //         });
  //         attachOrgName(marker, orgNames[i]);
  //
  //       } // End For Loop
  //
  //
  //       function attachOrgName(marker, orgName) {
  //         var infowindow = new google.maps.InfoWindow({
  //           content: orgName
  //         });
  //
  //         marker.addListener('click', function() {
  //           infowindow.open(marker.get('map'), marker);
  //         });
  //       }
  //
  //     }); // End getAll
  //   }
  // });
// ============= End NgMap Method ===============
// } // End of getLocation






  // ========== Find nearby Locations ==========
  // function getNearby(pos){
  //   logRegFactory.getNearby(pos, function(output){
  //     $scope.within2miles = output.data.within2miles;
  //     $scope.within5miles = output.data.within5miles;
  //     $scope.within10miles = output.data.within10miles;
  //     $scope.loading = false;
  //   });
  //
  // };




  // ========== Search for a locations by city name ==========
  // $scope.citySearch = function(){
  //
  //   if ($scope.SearchCity.$pristine){
  //     // Do Nothing
  //     // console.log ('not touched')
  //   }
  //
  //   if ($scope.SearchCity.$dirty){
  //     if ($scope.SearchCity.city.$invalid){
  //       // console.log('city invalid');
  //     }
  //     else if ($scope.SearchCity.state.$invalid){
  //       // console.log('state invalid');
  //     }
  //     else {
  //       $scope.searchBy = {city: $scope.city, state: $scope.state};
  //       $scope.noLocations = '';
  //       $scope.searchedCity = {};
  //       searchFactory.citySearch($scope.searchBy, function(output){
  //         if (output.data.error){
  //           $scope.noLocations = "No Locations Found";
  //         } else {
  //           // console.log(output.data);
  //           $scope.searchedCity = output.data;
  //         }
  //       });
  //     }
  //
  //   }
  //
  //
  // } // End citySearch



  // ========== Open link in new tab ==========
  // $scope.linkModelFunc = function (linkedSite){
  //   // console.log(linkedSite);
  //   var site = 'http://'
  //   site += linkedSite;
  //   $window.open(site);
  // }


  // ========== Accordian Functions ==========
  // $scope.expandCallback = function (index, id) {
  // };
  //
  // $scope.collapseCallback = function (index, id) {
  // };
  //
  // $scope.$on('accordionA:onReady', function () {
  // });











// ===== Sleep Function =====
// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// };
