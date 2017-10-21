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

  factory.getAll = function(callback){
    $http.post('/getAll').then(function(output){
      callback(output)
    });
  };


return factory;
}]); // End home Factory
