// =========================================================================
// ============================== Require ==================================
// =========================================================================
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const NodeGeocoder = require('node-geocoder');
const distance = require('google-distance');

distance.key = ('AIzaSyBN4DR6_NEex4E0iFmkgDgqANrO69pCgtM');


var googleOptions = {
  provider: 'google',
  apiKey: 'AIzaSyBN4DR6_NEex4E0iFmkgDgqANrO69pCgtM'
};
var geocoder = NodeGeocoder(googleOptions)

var Admin = mongoose.model('Admin');
var Organization = mongoose.model('Organization');


var AdminEmail = "helpinghoursadm@gmail.com";

// =========================================================================
// ============================== Methods ==================================
// =========================================================================

module.exports = (function(){
  return {

    loginAdmin: function(req,res){
      var myEmail = req.body.email.toLowerCase();
      // Find user by email
      // if(myEmail === AdminEmail){
        Admin.findOne({email: myEmail}, function(err, oneAdmin){
          if(err){
            console.log('===== Error ====='.red);
            console.log(err);
          } else {
            // -=-=-=-=-=~~~~ If No Admin Yet ~~~~-=-=-=-=-=
            if(oneAdmin == null){
              if(myEmail === AdminEmail){
                var pw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
                var createAdminLevel1 = new Admin({ email: myEmail, password: pw, level: 1 });
                createAdminLevel1.save(function(err) {
                  if (err){
                    console.log('==== Error When Creating Admin Level 1 ===='.red);
                    console.log(err);
                  } else {
                    console.log('Main Admin Created'.yellow);
                    res.json(true);
                  }
                });
              } else {
                res.json({error: "Email or Password do not match"});
              }
            }
            // -=-=-=-=-=~~~~ End If No Admin Yet ~~~~-=-=-=-=-=

            else if(oneAdmin){
              // Authenticate password
              if(bcrypt.compareSync(req.body.password, oneAdmin.password)){
                res.json(true)
              } else {
                res.json({error: "Email or Password do not match"});
              }
            }
          }
        })
    }, // End Admin Login Method


    getAllAdmin: function(req,res){
      Organization.find(({}), function(err, allOrgs){
        if (err){
          console.log('===== ERROR ====='.red);
          console.log(err);
          res.json({error: 'Something went wrong :('})
        } else{
          var sendBack = [];
          for (var i = 0; i<allOrgs.length; i++){
            sendBack.push({
                        organization: allOrgs[i].organization,
                        formattedAddress: allOrgs[i].formattedAddress,
                        streetNumber: allOrgs[i].streetNumber,
                        streetName: allOrgs[i].streetName,
                        city: allOrgs[i].city,
                        state: allOrgs[i].state,
                        zip:allOrgs[i].zip,
                        position: [allOrgs[i].latitude,allOrgs[i].longitude],
                        phone: phoneDisplay(allOrgs[i].phone),
                        website: allOrgs[i].website,
                        description: allOrgs[i].description,
                        email: allOrgs[i].email,
                        contactEmail: allOrgs[i].contactEmail,
                        _id: allOrgs[i]._id
                      }
            );
          };
          res.json(sendBack);
        }
      })
    },


    deleteOrgAdmin: function (req,res){
      console.log('Removed Organization'.red);
      console.log(req.body);
      Organization.remove({_id:req.body.id}, function(err){
        if(err){
          console.log('===== Error Removing Organization ====='.red);
          console.log(err);
          res.json({error: 'Error Removing Organization'});
        } else {
          res.json(true);
        }
      })
    },

    editOrgAdmin: function(req,res){
      // console.log(req.body);
      Organization.findOne({_id: req.body.id}, function(err, oneOrg){
        if(err){
            console.log('===== Error Finding Organization ====='.red);
            console.log(err);
            res.json({error: 'Error Finding Organization'});
        } else if(oneOrg){
          // console.log(oneOrg);
          oneOrg.organization = req.body.name;
          oneOrg.email = req.body.email;
          if(req.body.phone){
            oneOrg.phone = req.body.phone.replace(/[-+()\s]/g, '');;
          };
          oneOrg.save(function(err){
            if(err){
              console.log('===== Error Updating Org - Admin');
              console.log(err);
              res.json({error: 'Error Updating Organization'});
            } else {
              res.json(true);
            }
          })

        }

      })

    },





      } // End Return
    })();






    // ============================== Helper Functions ==============================
    function phoneDisplay(str){
      if(!str){
        return;
      }
      if (str.length == 10){
        return '(' + str.substr(0,3) + ')' + str.substr(3,3) + '-' + str.substr(6);
      } else {
        return str.substr(0,1) + '(' + str.substr(1,3) + ')' + str.substr(4,3) + '-' + str.substr(7);
      }
    };
