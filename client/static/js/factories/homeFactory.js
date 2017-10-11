// =========================================================================
// =========================== Home Factory ===========================
// =========================================================================
app.factory('homeFactory', ['$http', function ($http){
  var factory = {};


  factory.findAllOrgs = function(callback){
    // console.log(in);
    $http.post('/findAllOrgs').then(function(output){
      callback(output)
    });
  };





return factory;
}]); // End home Factory
