// =========================================================================
// =========================== Home Factory ===========================
// =========================================================================
app.factory('homeFactory', ['$http', function ($http){
  var factory = {};


  factory.findAllOrgs = function(callback){
    $http.post('/findAllOrgs').then(function(output){
      callback(output)
    });
  };

  factory.getNearBy = function(input, callback){
    $http.post('/getNearbyWeb', input).then(function(output){
      callback(output)
    });
  };



return factory;
}]); // End home Factory
