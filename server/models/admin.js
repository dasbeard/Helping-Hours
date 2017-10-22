// =========================================================================
// ============================== Require ==================================
// =========================================================================
const mongoose = require('mongoose');


// =========================================================================
// ============================== Schemas ==================================
// =========================================================================
var AdminSchema = new mongoose.Schema({
  email:{
        type: String,
        required: true,
        validate: [{
          validator: function (email){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
          },
          error: "{ VALUE } is not a valid email"
        }]
      },
  level: {type: Number, required: true, minlength: 1, trim: true},

  password: {type: String, required: true, minlength: 5, trim: true},
  // county: {type: String, required: true, trim: true},

}, {timestamps: true});

// =========================================================================
// ========================== Set Schema Name===============================
// =========================================================================

mongoose.model('Admin', AdminSchema);
