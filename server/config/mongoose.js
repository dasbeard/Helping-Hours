// =========================================================================
// ============================== Require ==================================
// =========================================================================
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const fs = require('fs');
// const database_name = 'HelpingHours'; // Replace with new Database name
const database_name = 'ChowTemp'; // Replace with new Database name

// =========================================================================
// ============================ Connection =================================
// =========================================================================
var uri = 'mongodb://localhost/' + database_name;
mongoose.createConnection(uri, { server: { poolSize: 4 }});


// mongoose.connect('mongodb://localhost/'+ database_name);


// =========================================================================
// =========================== Path to Models===============================
// =========================================================================
var models_path = __dirname + '/../models';

// =========================================================================
// ========================= Read Models Files =============================
// =========================================================================
fs.readdirSync(models_path).forEach(function(file){
  if(file.indexOf('.js')>0){
    require(models_path + '/' + file);
  }
});
