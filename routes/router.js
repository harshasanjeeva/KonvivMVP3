var envvar = require('envvar');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var plaid = require('plaid');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys');


var app = module.exports = express.Router();

//var accounts = require('./accounts');
// We store the access_token in memory - in production, store it in a secure
// persistent data store

  var connection = mysql.createConnection({
    host: "konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",
    user: "harsha",
    password: "varshaA1!",
    database:"testSchema"
  });

  app.get('/', function (req, res) {
    // res.status(200).send({"sucesss": true, "result": "hi"});
        res.status(200).send({"success": true});
});

var user_id;

// app.post('/register', function(req, res){
//     let email = req.body.email;

//     connection.connect(function(err) {
//         connection.query("SELECT * FROM UserTable WHERE username = ? ", [email], (err, result, fields) => {

//             if(result)  {
//                 if(!result[0]) {
//                     bcrypt.genSalt(10, function(err, salt) {
//                         bcrypt.hash(req.body.password, salt, function(err, hash) {
//                             var newUser = {
//                                 email: req.body.email,
//                                 password: hash
//                             }

//                             var userData = [newUser];
//                             var values = [];
//                             user_id = Math.floor(Math.random() * 10000);

//                             for (var i = 0; i < 1; i++) {
//                                 console.log(userData)
//                                 values.push([user_id, userData[i].email, userData[i].password])
//                             }

//                             if (err) throw err;
//                             connection.query("INSERT INTO UserTable (id, username, password) VALUES ?", [values], function (err, result, fields) {
//                                 if (err) throw err;
//                                 console.log(result);
//                                 res.status(200).send({"success":true, "result":result, "user_id":user_id});
//                             });
//                             connection.query("SELECT * FROM UserTable", (err, res, fields) => {
//                                 console.log('result is ', res);
//                         })

//                         });
//                     });
//                 }
//                 else if(result[0].username === email) {
//                     console.log(">>>>>>>>>>>>>>>. we are getting the error")
//                     res.send({success: false})
//                 }
//             }
//         })
//     });
// });

// app.post('/login', function(req, res) {
//     connection.connect(function(err) {
//         let email = req.body.email;
//         let password = req.body.password;
//         user_id = req.body.user_id;

//         connection.query("SELECT * FROM UserTable WHERE username = ? ", [email], function(error, results, fields) {
//             if (results[0].password) {
//                 bcrypt.compare(req.body.password, results[0].password, function(err, result) {
//                     const token = jwt.sign({email}, tokenKey.jwtSecret);
//                     if(result) {

//                         var options = {
//                             args: ["hi",user_id]
//                         };

//                         PythonShell.run('bucket-new.py', options, function (err, results) {
//                             //if (err) throw err;
//                             // results is an array consisting of messages collected during execution
//                             console.log('results: %j', results);
//                         });

//                         return res.send(
//                             {
//                                 "sucesss":true, "login":'yes',
//                                 token: token
//                             });
//                     }
//                     else {
//                         console.log('catch all happens?')
//                         return res.status(400).send();
//                     }
//                 })
//             }
//         });
//     });
// });

  app.get('/accounts', function (req, res) {
    // res.status(200).send({"sucesss": true, "result": "hi"});
    connection.query("SELECT * FROM accountsTable", function (err, result, fields) {
        if (err) throw err;
        res.status(200).send({"success": true, "result": result});
    });
});

app.get('/accounts/:id', function (req, res) {
    if (req.params.id != null) {
        // connection.query("SELECT * FROM transactionTableTest WHERE account_id = 'rx3maAP9KWf55zQmKyqMTgZ7p4drw4cmq8jy8'", function (err, result) {
        connection.query("SELECT * FROM transactionTable WHERE user_id = ?", [user_id], function (err, result) {
            if (err) throw err;
            res.status(200).send({"success": true, "result": result});
        });
    }
});
app.get('/transactions', function(req, res){
    connection.query("SELECT * FROM transactionsTable WHERE user_id = ?", [user_id], (err, result, fields) => {
        console.log('result is ', result);
        res.status(200).send({"sucesss":true, "result":result});
    });
});
app.get('/buckets', function(req, res) {
    connection.query("SELECT * FROM bucketsTable WHERE user_id = ?", [user_id], function(err, result, fields) {
        if (err) throw err;
        // console.log(result);
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/notifications', function(req, res) {
    connection.query("SELECT * FROM notificationsTable WHERE user_id = ?", [user_id], function(err, result, fields) {
        if (err) throw err;
        res.status(200).send({"success": true, "result": result});
    });
});
app.post('/notifications', function(req, res) {
    var name = req.body.name;
    var date = req.body.date;
    connection.query("INSERT INTO notificationsTable (name, date) VALUES (?, ?) WHERE user_id = ?", [name, date], [user_id], function(err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/list', function(req, res){
     connection.query("SELECT * FROM UserTable WHERE user_id = ?", [user_id], (err, result, fields) => {
       console.log('result is ', result);
       res.status(200).send({"sucesss":true, "result":result});
     });
});
