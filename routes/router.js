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

app.get('/accounts/:user_id', function (req, res) {
    user_id = req.params.user_id;
    // res.status(200).send({"sucesss": true, "result": "hi"});
    connection.query("SELECT * FROM accountsPlaidTable WHERE user_id = ?", [user_id], function (err, result, fields) {
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
// app.get('/transactions', function(req, res){
//     connection.query("SELECT * FROM transactionTable WHERE user_id = ?", [user_id], (err, result, fields) => {
//         console.log('result is ', result);
//         res.status(200).send({"sucesss":true, "result":result});
//     });
// });
app.get('/transactions/:user_id', function(req, res){
    user_id = req.params.user_id;
    console.log("node new master transaction/:user_id user id: ", user_id);

    connection.query("SELECT * FROM transactionsTable WHERE user_id = ?", [user_id], (err, result, fields) => {
        // console.log('transaction result is ', result);
    res.status(200).send({"sucesss":true, "result":result});
});
});
app.get('/buckets/:user_id', function(req, res) {
    user_id = req.params.user_id;
    // console.log("node-new buckets user id: ", user_id);
    connection.query("SELECT * FROM bucketFillTest WHERE id = ?", [user_id], function(err, result, fields) {
        if (err) throw err;
        // console.log("node-new buckets result: ", result);
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/notifications/:user_id', function(req, res) {
    user_id = req.params.user_id;
    connection.query("SELECT * FROM notificationsTable WHERE user_id = ?", [user_id], function(err, result, fields) {
        if (err) throw err;
        res.status(200).send({"success": true, "result": result});
    });
});
app.post('/notifications/:user_id', function(req, res) {
    user_id = req.params.user_id;
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

