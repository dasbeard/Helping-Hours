// =========================================================================
// ========================= Required Models ===============================
// =========================================================================
var organizations = require('./../controllers/organizations.js');
var admin = require('./../controllers/admin.js');


module.exports = function(app){
// =========================================================================
// ======================= Organization Routes =============================
// =========================================================================

  app.post('/findLocation', function(req,res){
    organizations.findLocation(req,res)
  });

  app.post('/findLatLng', function(req,res){
    organizations.findLatLng(req,res)
  });

  app.post('/newRegistration', function(req,res){
    organizations.newRegistration(req,res)
  });

  app.post('/login', function(req,res){
    organizations.login(req,res)
  });

  app.post('/getOrgInfo', function(req,res){
    organizations.getOrgInfo(req,res)
  });

  app.post('/addDay', function(req,res){
    organizations.addDay(req,res)
  });

  app.post('/removeDay', function(req,res){
    organizations.removeDay(req,res)
  });

  app.post('/updateServices', function(req,res){
    organizations.updateServices(req,res)
  });

  app.post('/findAllOrgs', function(req,res){
    organizations.findAllOrgs(req,res)
  });

  app.post('/getNearbyWeb', function(req,res){
    organizations.getNearbyWeb(req,res)
  });

  app.post('/citySearch', function(req,res){
    organizations.citySearch(req,res)
  });





  app.post('/loginAdmin', function(req,res){
    admin.loginAdmin(req,res)
  });

  app.post('/getAllAdmin', function(req,res){
    admin.getAllAdmin(req,res)
  });

  app.post('/removeOrg', function(req,res){
    admin.removeOrg(req,res)
  });

  app.post('/deleteOrgAdmin', function(req,res){
    admin.deleteOrgAdmin(req,res)
  });

  app.post('/editOrgAdmin', function(req,res){
    admin.editOrgAdmin(req,res)
  });



  // app.get('/apiTest', function(req,res){
  //   organizations.apiTest(req,res)
  // });
  //
  // app.get('/apiTest2/:location', function(req,res){
  //   organizations.apiTest2(req,res)
  // });
  //
  // app.get('/apiTest3/:location', function(req,res){
  //   organizations.apiTest3(req,res)
  // });

}; // End Routes
