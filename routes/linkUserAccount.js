var logger = require('morgan'),
  cors = require('cors'),
  http = require('http'),
  express = require('express'),
  errorhandler = require('errorhandler'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  envvar = require('envvar'),
  moment = require('moment'),
  mysql = require('mysql'),
  plaid = require('plaid');

  var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID', '57c4acc20259902a3980f7d2');
  var PLAID_SECRET = envvar.string('PLAID_SECRET', '10fb233c2a93dfcd42aa1a9d8a01d1');
  var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY', 'ebc098404b162edaadb2b8c6c45c8f');
  var PLAID_ENV = envvar.string('PLAID_ENV', 'development');


// var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID', '57c4acc20259902a3980f7d2');
// var PLAID_SECRET = envvar.string('PLAID_SECRET', '3cd9b652e3d0bd9977b5e558046f7c');
// var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY', '1ba24d7f24b413a578c4e8e52309a8');
// var PLAID_ENV = envvar.string('PLAID_ENV', 'development');


var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);
var app = module.exports = express.Router();

const connection = mysql.createConnection({
  host: "konvivtest1.c0ebjxhggelq.us-east-2.rds.amazonaws.com",
  user: "harsha",
  password: "varshaA1!",
  database:"testSchema"
});




  app.get('/linkaccount', function(request, response, next) {
    console.log("app loading...");
    response.render('plaid.ejs', {
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
    console.log("app loaded");
});



app.post('/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      var msg = 'Could not exchange public_token!';
      console.log(msg + '\n' + error);
      return response.json({
        error: msg
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);
    response.json({
      'error': false
    });
  });
});

app.get('/accounts', function(request, response, next) {
  // Retrieve high-level account information and account and routing numbers
  // for each account associated with the Item.
  client.getAuth(ACCESS_TOKEN, function(error, authResponse) {
    if (error != null) {
      var msg = 'Unable to pull accounts from the Plaid API.';
      console.log(msg + '\n' + error);
      return response.json({
        error: msg
      });
    }
    console.log(response);
    console.log(authResponse.accounts);
    response.json({
      error: false,
      accounts: authResponse.accounts,
      numbers: authResponse.numbers,
    });
  });
});

app.post('/goback', function (request, response) {
  console.log("going to google.com");
  return response.redirect('http://localhost:8100');
});


app.post('/item', function(request, response, next) {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
    if (error != null) {
      console.log(JSON.stringify(error));
      return response.json({
        error: error
      });
    }

    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
      if (err != null) {
        var msg = 'Unable to pull institution information from the Plaid API.';
        console.log(msg + '\n' + error);
        return response.json({
          error: msg
        });
      } else {
        response.json({
          item: itemResponse.item,
          institution: instRes.institution,
        });
      }
    });
  });
});

// app.post('/transactions', function(request, response, next) {
//   // Pull transactions for the Item for the last 30 days
//   var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
//   var endDate = moment().format('YYYY-MM-DD');
//   client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
//     count: 250,
//     offset: 0,
//   }, function(error, transactionsResponse) {
//     if (error != null) {
//       console.log(JSON.stringify(error));
//       return response.json({
//         error: error
//       });
//     }
//     console.log('pulled ' + transactionsResponse.transactions.length + ' transactions');
//     response.json(transactionsResponse);
//     console.log(transactionsResponse);
//   });
// });

app.post('/transactions', function(request, response, next) {
  // Pull transactions for the Item for the last 30 days
  var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
    count: 250,
    offset: 0,
  }, function(error, transactionsResponse) {
    if (error != null) {
      console.log(JSON.stringify(error));
      return response.json({
        error: error
      });
    }
    console.log('pulled ' + transactionsResponse.transactions.length + ' transactions');
    response.json(transactionsResponse);
    console.log(transactionsResponse);
    
          //database connection start            
          var jsondata = transactionsResponse.transactions;
          var values = [];
          
          for(var i=0; i< jsondata.length; i++)
            {
            if(jsondata[i].category != null)
            values.push([jsondata[i].account_id, jsondata[i].amount, jsondata[i].date, jsondata[i].name, jsondata[i].category_id, jsondata[i].category[0]] );
            else
              {
                values.push([jsondata[i].account_id, jsondata[i].amount, jsondata[i].date, jsondata[i].name, jsondata[i].category_id, "other"]);
              }
            }
          console.log(values);

        //   connection.connect(function(err) {
        //       if (err) throw err;
        //     console.log("Connected!");
        //     connection.query('INSERT INTO transactionTable (account_id, amount, date, name, category_id, category ) VALUES ?', [values], function(err,result) {
        //       if (err) throw err;
        //       console.log("successful for insert for transaction");
        //       });
          
        //   connection.query("SELECT * FROM transactionTable", function (err, result) {
        //     if (err) throw err;
        //      console.log("query successful");
        //      console.log(result);
        //  });
        //  });
          //database connnection end

  });
});