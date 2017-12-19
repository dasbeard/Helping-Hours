// =========================================================================
// ============================== Require ==================================
// =========================================================================
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const NodeGeocoder = require('node-geocoder');
const distance = require('google-distance');

distance.key = ('AIzaSyBN4DR6_NEex4E0iFmkgDgqANrO69pCgtM');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

var googleOptions = {
  provider: 'google',
  apiKey: 'AIzaSyBN4DR6_NEex4E0iFmkgDgqANrO69pCgtM'
};
var geocoder = NodeGeocoder(googleOptions)

var Organization = mongoose.model('Organization');
var Admin = mongoose.model('Admin');


// =========================================================================
// ============================== Methods ==================================
// =========================================================================

module.exports = (function(){
  return {

    findLocation: function(req,res){
      // console.log(req.body);
      var searchAddress = req.body.street + ', ' + req.body.city;
      geocoder.geocode({address: searchAddress, zipcode: req.body.zip}, function(err, output){
        if (err){
          console.log('===== ERROR ====='.red);
          console.log(err);
        } else {
          res.json(output);
        }
      });
    }, // End findLocation method



    findLatLng: function(req,res){
      console.log(req.body);
      geocoder.reverse({lat:req.body.lat, lon:req.body.lng}, function(err, output) {
        if (err){
          console.log('===== ERROR ====='.red);
          console.log(err);
          res.json({error: "Please check your coordinates and try again"})
        } else {
          res.json(output);
        }
      });
    }, // End findLatLng method



    newRegistration: function (req,res){
      // console.log(req.body);
      // check if email is already registered
      Organization.findOne({email: req.body.email.toLowerCase()}, function(err, oneUser){
        if (err){
          console.log('===== ERROR ====='.red);
          console.log(err);
          res.json({error: "There was a problem creating your account"})
        } else {
          if (oneUser){
            var temp = oneUser.organization
            res.json({error: 'Email is already registered to "' + temp + '"'})
          }
          else {
            // Create new Organization
            var myEmail = req.body.email.toLowerCase();
            var pw = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
            var newOrganization = new Organization({
              organization: req.body.orgName, formattedAddress: req.body.address.formattedAddress, streetNumber: req.body.address.streetNumber, streetName: req.body.address.streetName, city: req.body.address.city, neighborhood:req.body.address.extra.neighborhood.toLowerCase(), state: req.body.address.administrativeLevels.level1short, zip: req.body.address.zipcode, latitude: req.body.address.latitude, longitude: req.body.address.longitude, email: myEmail, password: pw,
            })
            // Save new Organization
            newOrganization.save(function(err){
              if (err){
                console.log('==== Error When saving new organization ===='.red);
                console.log(err);
                res.json({error: "Error When saving Organization"});
              } else {
                // console.log('==== Successfuly Registered ===='.yellow);
                var toSendBack = {id: newOrganization._id,
                  formattedAddress: newOrganization.formattedAddress,
                  organization: newOrganization.organization,
                };
                // Send Email to Admin
                const msg = {
                  to: 'helpinghoursadm@gmail.com',
                  from: 'helpinghoursadm@gmail.com',
                  subject: 'New User on Helping Hours',
                  text: newOrganization.organization + ' just registered a location at: ' + newOrganization.formattedAddress + ' With the email account: ' + newOrganization.email,
                };
                sgMail.send(msg);

                res.json({success: true, sentback: toSendBack})
              }
            });
          }
        }
      });
    }, // End newRegistration method




    login: function(req,res){
      var myEmail = req.body.email.toLowerCase();
      // Find user by email
      Organization.findOne({email: myEmail}, function(err, oneUser){
        if(err){
          console.log('====== Error ======'.red);
          console.log(err);
          res.json({error: "There was a problem finding your account"})
        } else {
          if(!oneUser){
            // console.log('====== user NOT Found ======'.yellow);
            res.json({error: "Email or Password Incorrect"});

          } else {
            // console.log('====== Checking password ======'.yellow);
            // Authenticate password
            if(bcrypt.compareSync(req.body.password, oneUser.password)){
              // console.log('====== Successfuly Logged In ======');
              var toSendBack = {id: oneUser._id,
                formattedAddress: oneUser.formattedAddress,
                organization: oneUser.organization,
              };
              res.json(toSendBack)
            } else {
              res.json({error: "Email or Password do not match"});
            }
          }
        }
      });
    }, // End Login Method



    getOrgInfo: function(req,res){
      // console.log(req.body);
      Organization.findOne({_id: req.body.id}, function(err, oneUser){
        // console.log(oneUser + 'Line 129'.yellow);

        if(err){
          console.log('====== Error ======'.red);
          console.log(err);
          res.json({error: err});
        }
        else {
          var toSendBack = {
                            orgName: oneUser.organization, website: oneUser.website, formattedAddress: oneUser.formattedAddress, contactEmail: oneUser.contactEmail, phone: oneUser.phone, description: oneUser.description, hoursOfOperation: oneUser.hoursOfOperation, daysServingFood: oneUser.daysServingFood, services: oneUser.services, lat: oneUser.latitude, lng: oneUser.longitude
                            };
          res.json(toSendBack);
        }
      });
    }, // End getOrgInfo method



    addDay: function(req,res){
      Organization.findOne({_id: req.body.id}, function(err, oneOrg){
        if (err){
          console.log('===== Error ====='.red);
          console.log(err);
          res.json({error: 'Problem Finding Record'})
        } else {
          if(req.body.type === 'HOP'){
            for(i=0; i<req.body.days.length;i++){
              oneOrg.hoursOfOperation.push(req.body.days[i])
            };
            sortByTimes2(oneOrg.hoursOfOperation);
              oneOrg.save(function(err){
                if (err){
                  console.log('==== Error When saving new day ===='.red);
                  console.log(err);
                  res.json({error: 'Problem Saving Day'})
                } else {
                  res.json(true);
                }
              });
          } else {
            for(i=0; i<req.body.days.length;i++){
              oneOrg.daysServingFood.push(req.body.days[i])
            };
            sortByTimes2(oneOrg.daysServingFood);
            oneOrg.save(function(err){
              if (err){
                console.log('==== Error When saving new day ===='.red);
                console.log(err);
                res.json({error: 'Problem Saving Day'})
              } else {
                res.json(true);
              }
            });
          }
        }
      })
    },



    removeDay: function(req,res){
      // console.log(req.body);
      Organization.findOne({_id: req.body.id}, function(err, oneUser){
        if (err){
          console.log('==== Error When finding user ===='.red);
          console.log(err);
          res.json({error: "Something went wrong!"});
        } else {
          if(req.body.service == 'hoursOfOperation'){
            oneUser.hoursOfOperation.splice(req.body.index,1);
            oneUser.save(function(err){
              if (err){
                console.log('==== Error When removing day ===='.red);
                console.log(err);
                res.json({error: "Something went wrong!"});
              } else {
                res.json(true);
              }
            })
          } else if(req.body.service == 'daysServingFood'){
            oneUser.daysServingFood.splice(req.body.index,1);
            oneUser.save(function(err){
              if (err){
                console.log('==== Error When removing day ===='.red);
                console.log(err);
                res.json({error: "Something went wrong!"});
              } else {
                res.json(true);
              }
            })
          }
        }
      })
    },


    updateServices: function(req,res){
      // console.log(req.body);
      Organization.findOne({_id: req.body.id}, function(err, oneOrg){
        if (err){
          console.log('==== Error updating services ===='.red);
          console.log(err);
          res.json({error: "Something went wrong!"});
        } else {
          oneOrg.services = req.body.checkboxes;

          // if(req.body.contactEmail){
            oneOrg.contactEmail = req.body.contactEmail;
          // };
          // if(req.body.description){
            oneOrg.description = req.body.description;
          // };
          // if(req.body.phone){
            oneOrg.phone = req.body.phone;
          // };
          // if(req.body.website){
            oneOrg.website = req.body.website;
          // };
          oneOrg.save(function(err){
            if(err){
              console.log('===== Error ====='.red);
              console.log(err);
              res.json({error: "Something went wrong!"});
            } else {
              res.json(true);
            }
          })
        }
      })
    }, // End updateServices


    findAllOrgs: function(req,res){
      Organization.find(({}), function(err, allOrgs){
        if (err){
          console.log('===== ERROR ====='.red);
          console.log(err);
          res.json({error: 'Something went wrong!'})
        } else{
          var sendBack = [];
          for (var i = 0; i<allOrgs.length; i++){
            sendBack.push({ formattedAddress: allOrgs[i].formattedAddress,
                        website: allOrgs[i].website,
                        address: allOrgs[i].streetNumber + ' ' + allOrgs[i].streetName + ', ' + allOrgs[i].city,
                        organization: allOrgs[i].organization,
                        description: allOrgs[i].description,
                        position: [allOrgs[i].latitude,allOrgs[i].longitude],
                        phone: phoneDisplay(allOrgs[i].phone),
                        // latitude: allOrgs[i].latitude,
                        // longitude: allOrgs[i].longitude,
                        _id: allOrgs[i]._id
                      }
            );
          };
          res.json(sendBack);
        }
      })
    },





    getNearbyWeb: function(req,res){
      // console.log(req.body);
      Organization.find(({}), function(err, allLocations){
        if (err){
          console.log('==== Error When finding user ===='.red);
          console.log(err);
          res.json({error: err});
        } else {
          var within2miles = [];
          var within5miles = [];
          var within25miles = [];
          var lat = req.body.lat;
          var long = req.body.lng;
          var destinations = [];
          for (var i=0; i<allLocations.length; i++){
          if(myDistance(lat, long, allLocations[i].latitude, allLocations[i].longitude)<=2){
            var org = {_id: allLocations[i]._id, formattedAddress: allLocations[i].formattedAddress, organization: allLocations[i].organization, website: allLocations[i].website};
            within2miles.push(org);

            } else if (myDistance(lat, long, allLocations[i].latitude, allLocations[i].longitude)>2 && myDistance(lat, long,             allLocations[i].latitude, allLocations[i].longitude)<=5) {
              var org = {_id: allLocations[i]._id, formattedAddress: allLocations[i].formattedAddress, organization: allLocations[i].organization, website: allLocations[i].website};
            within5miles.push(org);

          } else if (myDistance(lat, long, allLocations[i].latitude, allLocations[i].longitude)>5 && myDistance(lat, long,             allLocations[i].latitude, allLocations[i].longitude)<=25) {
              var org = {_id: allLocations[i]._id, formattedAddress: allLocations[i].formattedAddress, organization: allLocations[i].organization, website: allLocations[i].website};
              within25miles.push(org);
            }
          }
          var sendBack = {within2miles, within5miles, within25miles};
          res.json(sendBack);
        }
      })
    },


    citySearch: function(req,res){
      var city = titleCase(req.body.city)
      Organization.find({$and: [{state: req.body.state}, {$or: [{city: city}, {neighborhood: req.body.city.toLowerCase()}]}]}, function(err, results){
        if (err){
          console.log('==== Error finding by state ===='.red);
          console.log(err);
          res.json({error: "Something went wrong!"});
        } else {
          var sendBack = [];
          for (var i=0; i<results.length; i++){
            organization = { formattedAddress: results[i].formattedAddress, organization: results[i].organization, website: results[i].website, _id: results[i]._id}
            sendBack.push(organization);
          };
          if (sendBack.length == 0){
            res.json({error: 'No locations found'});
          } else {
            res.json(sendBack);
          }
        }
      })
    },




// ========================================================================
// ================================ API's =================================
// ========================================================================


// ============== Get all info from DB for API ==============
apiTest: function(req,res){
  Organization.find({}, function(err, data){
    if (err){
      console.log('===== Error ====='.red);
      console.log(err);
    } else {
      res.json(data);
    }
  });
}, // End API Test

//
// apiTest3: function(req,res){
//   console.log(req.params);
//   var myLatLng =  req.params.location.split(',');
//   var myLat = parseFloat(myLatLng[0]);
//   var myLng = parseFloat(myLatLng[1]);
//
//   Organization.find(({}), function(err, allLocations){
//     if (err){
//       console.log('==== Error When finding user ===='.red);
//       console.log(err);
//     } else {
//       var sendBack =[];
//       for (var i=0; i<allLocations.length; i++){
//         if(myDistance(myLat, myLng, allLocations[i].latitude, allLocations[i].longitude)<=10){
//           sendBack.push(allLocations[i]);
//         }
//       }
//       res.json(sendBack);
//     }
//   }) // End find All
//
// }, // End API Test 3
//
//
//
// // ============== Get all info from DB for API Using Distance Matrix ==============
// apiTest2: function(req,res){
//
//   Organization.find(({}), function(err, allLocations){
//     if (err){
//       console.log('==== Error When finding user ===='.red);
//       console.log(err);
//     } else {
//       // console.log(allLocations);
//       var sendBack = [];
//       var origins = req.params.location
//       var destinations = [];
//
//   // Need to make sure that all locations are less than 25 per google api
//   // if (allLocations.length > 2){
//   //   console.log('greater than 2');
//   //   console.log(allLocations.length);
//   // }
//       for (var i=0; i<allLocations.length;i++){
//         destinations.push(allLocations[i].latitude + ',' + allLocations[i].longitude);
//       }
//       distance.get({origin: req.params.location, destinations}, function(err, data) {
//           if (err){
//             return console.log(err)
//           } else {
//             // console.log(data);
//             for (var i=0; i<data.length; i++){
//               if (data[i].distanceValue < 16500){
//                 sendBack.push(allLocations[i]);
//
//               }
//             }
//             res.json(sendBack)
//           }
//       });
//
//     }
//   });
// }, // End apiTest2
//
//
//
//
//










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

function sortByTimes2(input){
  input.sort(function sortByOpen(a, b) {
    var day1 = a.open;
    var day2 = b.open;
    return day1 > day2;
  });

  input.sort(function sortByDay(a, b) {
    var day1 = a.id;
    var day2 = b.id;
    return day1 > day2;
  });


  return input;
}


function intParsing(input){
  var myArr = ('' + input).split('');
  var myStr = '';

  for (var i=0; i<myArr.length; i++){
    if (!isNaN(myArr[i])){
      myStr += myArr[i];
    }
  }
return Number(myStr);
} // End intParsing




function checkNewReg(regObj){
  if(!regObj.organization){
    return 'Organization name is required';
  }
  else if (regObj.organization.length < 3){
    return 'Organization name must be at least 3 characters long';
  }
  else if (!regObj.street1){
    return 'Street address is required';
  }
  else if (regObj.street1.length < 3){
    return 'Street address must be at least 3 characters long';
  }
  else if (!regObj.city){
    return 'Please enter a City Name';
  } else {
    return true;
  }
} // End checkNewReg



function validateLocation(orgObj){
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  var phoneRegex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

  var websiteRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

if (!emailRegex.test(orgObj.email)){
    return 'Please enter in a valid email';
  }
  else if (orgObj.password == "     ") {
    return 'Please enter a password to continue';
  }
  else if (!orgObj.password){
    return 'Please enter a password to continue';
  }
  else if (orgObj.password.length < 5){
    return 'Password must be at least 5 characters long';
  }
  else if(orgObj.password != orgObj.password_conf){
    return 'Passwords do not match!';
  }
  return true;
}; // End Validate Location





// ===== Sleep Function =====
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};


function titleCase(str) {
     words = str.toLowerCase().split(' ');

     for(var i = 0; i < words.length; i++) {
          var letters = words[i].split('');
          letters[0] = letters[0].toUpperCase();
          words[i] = letters.join('');
     }
     return words.join(' ');
};





// ========== Distance Matrix 2.0 ==========
function myDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
