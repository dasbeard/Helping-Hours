// =========================================================================
// =========================== Admin Factory ===========================
// =========================================================================
app.factory('adminFactory', ['$http', function ($http){
  var factory = {};

  factory.loginAdmin = function(input, callback){
    $http.post('/loginAdmin', input).then(function(output){
      callback(output)
    });
  };

  factory.getAllAdmin = function(callback){
    $http.post('/getAllAdmin').then(function(output){
      callback(output)
    });
  };

  factory.deleteOrg = function(input, callback){
    $http.post('/deleteOrgAdmin', input).then(function(output){
      callback(output)
    });
  };

  factory.editOrgAdmin = function(input, callback){
    // console.log(input);
    $http.post('/editOrgAdmin', input).then(function(output){
      callback(output)
    });
  };


return factory;
}]); // End home Factory
