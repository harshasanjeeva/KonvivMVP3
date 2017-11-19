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



app.get('/list', function(req, res){
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

      connection.query("INSERT INTO UserTestTable (id, username, password) VALUES ('45', 'Harsha','123456789')", function (err, result, fields) {
        if (err) throw err;
         console.log("query successful");
         console.log(result);
         res.status(200).send({"sucesss":true, "result":result});
     });
     connection.query("SELECT * FROM UserTestTable", (err, res, fields) => {
       console.log('result is ', res);
     })
     });
     console.log("this is the JSON data that we are sending");
 //   res.status(200).send({"sucesss":true, "result":result1});
});
