var envvar = require('envvar');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var plaid = require('plaid');
var mysql = require('mysql');


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

  app.get('/accounts', function (req, res) {
    // res.status(200).send({"sucesss": true, "result": "hi"});
    connection.query("SELECT * FROM accountsTableTest", function (err, result, fields) {
        if (err) throw err;
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/accounts/:id', function (req, res) {
    if (req.params.id != null) {
        // connection.query("SELECT * FROM transactionTableTest WHERE account_id = 'rx3maAP9KWf55zQmKyqMTgZ7p4drw4cmq8jy8'", function (err, result) {
        connection.query("SELECT * FROM transactionTableTest WHERE account_id = ?", [req.params.id], function (err, result) {
            if (err) throw err;
            res.status(200).send({"success": true, "result": result});
        });
    }
});
app.get('/buckets', function(req, res) {
    connection.query("SELECT * FROM bucketsTest", function(err, result, fields) {
        if (err) throw err;
        // console.log(result);
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/notifications', function(req, res) {
    connection.query("SELECT * FROM notificationsTest", function(err, result, fields) {
        if (err) throw err;
        res.status(200).send({"success": true, "result": result});
    });
});
app.post('/notifications', function(req, res) {
    var name = req.body.name;
    var date = req.body.date;
    connection.query("INSERT INTO notificationsTest (name, date) VALUES (?, ?)", [name, date], function(err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(200).send({"success": true, "result": result});
    });
});
app.get('/list', function(req, res){
     connection.query("SELECT * FROM UserTestTable", (err, result, fields) => {
       console.log('result is ', result);
       res.status(200).send({"sucesss":true, "result":result});
     });
});
