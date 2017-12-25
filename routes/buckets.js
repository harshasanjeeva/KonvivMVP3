// var envvar = require('envvar');
// var express = require('express');
// var bodyParser = require('body-parser');
// var moment = require('moment');
// var plaid = require('plaid');
// var mysql = require('mysql');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const tokenKey = require('../config/keys');


// var app = module.exports = express.Router();

// //var accounts = require('./accounts');
// // We store the access_token in memory - in production, store it in a secure
// // persistent data store

//   var connection = mysql.createConnection({
//     host: "konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",
//     user: "harsha",
//     password: "varshaA1!",
//     database:"testSchema"
//   });

//   app.get('/', function (req, res) {
//     // res.status(200).send({"sucesss": true, "result": "hi"});
//         res.status(200).send({"success": true});
// });




// app.get('/buckets2/:user_id', function(req, res) {
//     user_id = req.params.user_id;
//     // console.log("node-new buckets user id: ", user_id);
//     trasactions = [];

//     connection.query("SELECT * FROM transactionsTable WHERE user_id = ?", [user_id], function(err, result, fields) {
//         if (err) throw err;
//         // console.log("node-new buckets result: ", result); 
//         res.status(200).send({"success": true, "result": result});
//     });


    function bucketIt(transactions, targets) {
      this.targets = targets
      this.history = []
    
      transactions.forEach(item => {
        this.addTransaction(-item.amount, item.category, item.name, new Date(item.date))
      })
    }
    
    bucketIt.prototype = {
      addTransaction: function(amount, category, label, data) {
        this.history.push({amount, category, label, data})
      },
    
      getRunningTotal: function() {
        let total = 0
        let groups = {}
        const history = this.history
    
        for(ix in history) {
          const item = history[ix]
    
          total += item.amount
    
          if(groups[item.category] === undefined) groups[item.category] = item.amount
          else groups[item.category] += item.amount
        }
    
        return {
          total: -total,
          groups
        }
      },
    
      allocate: function() {
        let {total, groups} = this.getRunningTotal()
    
        console.log('total', total)
        console.log('groups', groups)
        if(total > 0) {
          const commitments = this.targets.map(item => ({...item, spent: groups[item.category], goal:(item.target + (groups[item.category] || 0))}))
            .filter(item => item.goal > 0)
            .sort(item => -item.rank)
    
          console.log('commitments', commitments)
    
          const sum = commitments.reduce((accu, item) => item.rank + accu, 0)
          const split = total / sum
    
          console.log('outstanding', sum, 'split', split)
    
          const distribution = commitments.map(item => ({
            ...item,
            payment: (split * item.rank),
            outstanding: (item.goal - (split * item.rank))
          }))
    
          console.log('distribution', distribution)
    
          distribution.forEach(item => {
            groups[item.category] = {
              ...item,
              total:  item.target + -item.outstanding,
            }
          })
        }
    
        console.log('groups', groups)
    
        return {
          distribution: total,
          groups
        }
      },
    
      project: function(userId) {
        const { groups } = this.allocate()
        const output = []
        for(let i in groups) {
          const group = groups[i]
    
          if(typeof group === 'object') {
            output.push({
              Amount: group.spent,
              Category: i,
              bucket: group.target,
              bucket_fill: group.total,
              rem_income: group.goal,
              user_id: userId,
            })
          } else {
              
            output.push({
              Amount: group,
              Category: i,
              bucket: Math.abs(group) ,
              bucket_fill: Math.abs(group),
              rem_income: 0,
              user_id: userId,
            })
          }
        }
    
        return output;
      }
    }
    
    const testDate = [{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":389,"date":"2017-12-01T00:00:00.000Z","name":"Bill Payment CITIBANK-MASTERCARD CBOL 10016","category":"Transfer","category_id":"21003000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":371,"date":"2017-12-01T00:00:00.000Z","name":"Remitly","category":"Service","category_id":"18000000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-489,"date":"2017-11-30T00:00:00.000Z","name":"ACH Electronic Credit WAVE 2 WAVE SOLU PAYROL","category":"Transfer","category_id":"21009000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":674,"date":"2017-11-27T00:00:00.000Z","name":"ACH Electronic Debit - DISCOVER E-PAYMENT 951","category":"Payment","category_id":"16001000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":400,"date":"2017-11-27T00:00:00.000Z","name":"Bill Payment CITIBANK-MASTERCARD CBOL 2017112","category":"Transfer","category_id":"21003000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":56,"date":"2017-11-27T00:00:00.000Z","name":"Citibank Global Transfer 11/26 12:38a 5262258","category":"Transfer","category_id":"21006000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-1,"date":"2017-11-24T00:00:00.000Z","name":"Zelle Credit PAY ID:USBxyTU3a9AF ORG ID:USB N","category":"other","category_id":null,"user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-300,"date":"2017-11-24T00:00:00.000Z","name":"Zelle Credit PAY ID:USBxyUWinvfn ORG ID:USB N","category":"Transfer","category_id":"21005000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-500,"date":"2017-11-24T00:00:00.000Z","name":"Zelle Credit PAY ID:USBxyUWqhO9U ORG ID:USB N","category":"Transfer","category_id":"21005000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":25,"date":"2017-11-22T00:00:00.000Z","name":"Debit Card Purchase 11/20 04:22a #8306 CL*com","category":"other","category_id":null,"user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":112,"date":"2017-11-22T00:00:00.000Z","name":"Debit Card Purchase 11/20 04:46a #8306 WU *71","category":"Transfer","category_id":"21006000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":8,"date":"2017-11-20T00:00:00.000Z","name":"Fee for Non-Citibank ATM use","category":"Bank Fees","category_id":"10002000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-411,"date":"2017-11-15T00:00:00.000Z","name":"ACH Electronic Credit WAVE 2 WAVE SOLU PAYROL","category":"Transfer","category_id":"21009000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":50,"date":"2017-11-15T00:00:00.000Z","name":"ACH Electronic Debit - DISCOVER E-PAYMENT 951","category":"Payment","category_id":"16001000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":200,"date":"2017-11-14T00:00:00.000Z","name":"Debit Card Purchase 11/12 03:49a #8306 CL*com","category":"other","category_id":null,"user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":-400,"date":"2017-11-08T00:00:00.000Z","name":"Citibank Global Transfer 11/08 09:38p 5262258","category":"Transfer","category_id":"21005000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":770,"date":"2017-11-06T00:00:00.000Z","name":"ACH Electronic Debit - DISCOVER E-PAYMENT","category":"Payment","category_id":"16001000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":5,"date":"2017-11-03T00:00:00.000Z","name":"Debit PIN Purchase CVS/PHARM 02294--821 T San","category":"Shops","category_id":"19043000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":401,"date":"2017-11-02T00:00:00.000Z","name":"ACH Electronic Debit - CA102- Avalon Mo WEB P","category":"Payment","category_id":"16002000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":200,"date":"2017-11-02T00:00:00.000Z","name":"ACH Electronic Debit - DISCOVER E-PAYMENT 951","category":"Payment","category_id":"16001000","user_id":1105},{"account_id":"8ZQqLEo0XQI78XxZPzB8cp6QRbA7MEc5X8E0X","amount":886,"date":"2017-11-02T00:00:00.000Z","name":"Debit Card Purchase 10/31 11:25p #8306 WF STU","category":"other","category_id":null,"user_id":1105}]
    const stuff = new bucketIt(testDate, [
      // {category: 'Transfer', target:1500.00, rank: 1},
      {category: 'Service', target:1000.00, rank: 1},
      {category: 'Payment', target:1000.00, rank: 1},
      {category: 'other', target:1000.00, rank: 1},
      {category: 'Bank Fees', target:1000.00, rank: 1},
      {category: 'Shops', target:1000.00, rank: 1},
    ])
    
    console.log(stuff.project(123));


module.exports = bucketIt;


//});
