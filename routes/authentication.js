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
      console.log('and here')
      console.log('>>>>>>>>>>>>>>>> ', results)
      if (results[0].password) {
        bcrypt.compare(req.body.password, results[0].password, function(err, result) {
         if(result) {
           console.log('result is good', results[0].id);
             user_id = results[0].id;

             console.log("authentication.js login user id: ", user_id);


             console.log('I am hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ')
             // user_id= 4844;
             console.log('here')
             var options = {
                 args: ["hi",user_id]
             };
             
             PythonShell.run('bucket-new.py', options, function (err, results) {
                 //if (err) throw err;
                 // results is an array consisting of messages collected during execution
                 console.log('results: %j', results);
             });
            return res.send({"success":true, "login":'yes', "user_id":user_id});
         }
         else {
           console.log('catch all happens?')
           return res.status(400).send();
         }
       })
      }
    });
  });
});
