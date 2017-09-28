// =========================================================================
// =========================== Edit Factory ===========================
// =========================================================================
app.factory('editFactory', ['$http', function ($http){
  var factory = {};


  factory.getOrgInfo = function(input, callback){
    $http.post('/getOrgInfo', input).then(function(output){
      callback(output)
    });
  }



return factory;
}]); // End edit Factory
