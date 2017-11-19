const envvar = require('envvar');
const express = require('express');
const bodyParser = require('body-parser');
const plaid = require('plaid');
const mysql = require('mysql');
const bcrypt = require('bcrypt');




const app = module.exports = express.Router();

  const connection = mysql.createConnection({
    host: "konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",
    user: "harsha",
    password: "varshaA1!",
    database:"testSchema"
  });


//look up  local storage  session storage


app.post('/postTest', function(req, res){
     connection.connect(function(err) {
       bcrypt.genSalt(10, function(err, salt) {
         bcrypt.hash(req.body.password, salt, function(err, hash) {
             var newUser = {
               email: req.body.email,
               password: hash
             }

             var userData = [newUser];
             var values = [];

             for (var i = 0; i < 1; i++) {
               console.log(userData)
               values.push([, userData[i].email, userData[i].password])
             }

             if (err) throw err;
             connection.query("INSERT INTO UserTestTable (id, username, password) VALUES ?", [values], function (err, result, fields) {
               if (err) throw err;
                console.log("query successful");
                console.log(result);
                res.status(200).send({"sucesss":true, "result":result});
            });
            connection.query("SELECT * FROM UserTestTable", (err, res, fields) => {
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
    var email = req.body.email;
    var password = req.body.password;

    console.log('here')

    connection.query("SELECT * FROM UserTestTable WHERE username = ? ", [email], function(error, results, fields) {
      console.log('and here')
      console.log('>>>>>>>>>>>>>>>> ', results)
      if (results[0].password) {
        bcrypt.compare(req.body.password, results[0].password, function(err, result) {
         if(result) {
           console.log('result is good')
            return res.send({"sucesss":true, "login":'yes'});
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
