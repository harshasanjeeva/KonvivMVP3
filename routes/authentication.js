const envvar = require('envvar');
const express = require('express');
const bodyParser = require('body-parser');
const plaid = require('plaid');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PythonShell = require('python-shell');
const tokenKey = require('../config/keys');




const app = module.exports = express.Router();

  const connection = mysql.createConnection({
    host: "konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",
    user: "harsha",
    password: "varshaA1!",
    database:"testSchema"
  });


//look up  local storage  session storage

var user_id;

app.post('/register', function(req, res){
    console.log(tokenKey);
    connection.connect(function(err) {

        bcrypt.genSalt(10, function(err, salt) {

            bcrypt.hash(req.body.password, salt, function(err, hash) {
                var newUser = {
                    email: req.body.email,
                    password: hash
                }

                var userData = [newUser];
                var values = [];
                user_id = Math.floor(Math.random() * 10000);
                for (var i = 0; i < 1; i++) {
                    console.log(userData)
                    values.push([user_id, userData[i].email, userData[i].password])
                }

                if (err) throw err;
                connection.query("INSERT INTO UserTable (id, username, password) VALUES ?", [values], function (err, result, fields) {
                    if (err) throw err;
                    console.log("query successful");
                    console.log(result);
                    res.status(200).send({"success":true, "result":result, "user_id":user_id});
                });
                connection.query("SELECT * FROM UserTable", (err, res, fields) => {
                    console.log('result is ', res);
            })

            });
        });
    });
    console.log("this is the JSON data that we are sending");
});

app.post('/login', function(req, res) {
  console.log('---------------------- ', req.body)
  connection.connect(function(err) {
    var email = req.body.email;
    var password = req.body.password;

    connection.query("SELECT * FROM UserTable WHERE username = ? ", [email], function(error, results, fields) {

      console.log('and here');
      console.log('>>>>>>>>>>>>>>>> ', results);

      if (!results || results === null) {
          res.send({"success": false, "login":'no'});
      }
      else if (results[0]) {
          let pass = results[0].password;
          if (pass !== undefined && pass !== null) {
              bcrypt.compare(req.body.password, results[0].password, function(err, result) {
                  if (result) {
                      user_id = results[0].id;
                      var options = {
                        args: ["hi",user_id]
                    };
                    //PythonShell.run('bucket-new.py', options, function (err, results) {
                    PythonShell.run('./routes/bucket-new.py', options, function (err, results) {
                      // if (err) throw err;
                        // results is an array consisting of messages collected during execution
                        console.log('results: %j', results);
                    });
                      return res.send({"success":true, "login":'yes', "user_id":user_id});
                  }
                  else {
                      res.send({"success":false, "login":'no'});
                  }
              })
          }
      }
      else res.send({"success": false, "login":'no'});
    });
  });
});
