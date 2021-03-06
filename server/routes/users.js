var db = require('../database/db.js');
var bcrypt = require('bcryptjs');

module.exports = {
  test : function(req, res){
  res.send("RESTRICTED, you're in");
  },
  registerUser : function(req, res){
  var user = {
    username : req.body.username,
    f_name : req.body.f_name,
    l_name : req.body.l_name,
    password : req.body.password
  };

  //return;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
    var q = "INSERT INTO users (f_name, l_name, username, hash, salt) VALUES ('"+user.f_name +"'," + "'"+user.l_name +"'," + "'"+user.username +"'," + "'"+hash +"'," + "'"+salt +"');";
    var promise = db.executeQuery(q);
    promise.then(function(rows){
      req.session.regenerate(function(){
      req.session.user = {username : user.username, f_name : user.f_name, l_name : user.l_name};
      console.log("Successfully registered user " + user.username);
      res.status(200).end();
      });
    })
    .catch(function(err){
      console.log("Error registering user " + user.username);
      res.status(400).end();
    })
    });
  });
  },
  login : function(req, res){
    //res.write('ok');
    //res.end();
  var login_info = {
    username : req.body.username,
    password : req.body.password
  };
  console.log(login_info);
  //return;
  var q = "SELECT * FROM users WHERE username ='" +login_info.username +"';";
  var promise = db.executeQuery(q);
  promise.then(function(rows){
    user = rows['rows'][0];
    salt = user.salt;
    hash = user.hash;

    bcrypt.hash(login_info.password, salt, function(err, ret_hash){
    if(ret_hash == hash){
      req.session.regenerate(function(){
      req.session.user = {username : user.username, f_name : user.f_name, l_name : user.l_name};
      console.log("Successfully logged in " + req.session.user.username);
      res.json({'cookie' : {'sid' : req.session.id}}).status(200).end();
      });
    }
    else{
      res.status(400).end();
    }
    });
    //check user hash/salt and send user session to frontend
  })
    .catch(function(err){
      console.log(err);
      console.log("Error logging in " + req.session.user.username);
      res.status(400).end();
    })
  }
}
