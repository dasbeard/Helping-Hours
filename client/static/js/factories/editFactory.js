// =========================================================================
// =========================== Edit Factory ===========================
// =========================================================================
app.factory('editFactory', ['$http', function ($http){
  var factory = {};


  factory.getOrgInfo = function(input, callback){
    $http.post('/getOrgInfo', input).then(function(output){
      callback(output)
    });
  };

  factory.addDay = function(input, callback){
    $http.post('/addDay', input).then(function(output){
      callback(output)
    });
  };

  factory.removeDay = function(input, callback){
    $http.post('/removeDay', input).then(function(output){
      callback(output)
    });
  };

  factory.updateServices = function(input, callback){
    $http.post('/updateServices', input).then(function(output){
      callback(output)
    });
  };




return factory;
}]); // End edit Factory
