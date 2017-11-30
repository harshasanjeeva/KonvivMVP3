var logger = require('morgan'),
cors = require('cors'),
http = require('http'),
express = require('express'),
errorhandler = require('errorhandler'),
bodyParser = require('body-parser'),
helmet = require('helmet'),
envvar = require('envvar'),
PythonShell = require('python-shell'),
plaid = require('plaid');

const app = express();

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('public token', null);
app.use(cors());

if (process.env.NODE_ENV === 'development') {
app.use(logger('dev'));
app.use(errorhandler());
}

var port = process.env.PORT || 3001;


app.use(require('./routes/authentication.js'));
app.use(require('./routes/router.js'));
app.use(require('./routes/linkUserAccount'));




// PythonShell.run("bucket.py", function (err,stdout, stderr) {
//   console.log(stdout)
//   console.log(stderr)
//   if (err) {throw err; console.log(err);}
//   console.log('finished');
// });


// pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement) 
//   console.log(message);
// });

// // end the input stream and allow the process to exit 
// pyshell.end(function (err) {
//   if (err) throw err;
//   console.log('exit');
// });


// Provide the path of the python executable, if python is available as environment variable then you can use only "python"


// Function to convert an Uint8Array to a string
// var uint8arrayToString = function(data){
//     return String.fromCharCode.apply(null, data);
// };


// var user_id = 10;

//working-------------------------------
// PythonShell.run('bucket.py');
// var myPythonScript = "bucket.py";
// var pythonExecutable = "python";
// const spawn = require('child_process').spawn;
// const scriptExecution = spawn(pythonExecutable, [myPythonScript]);


// var myPythonScript = "test.py";
// var pythonExecutable = "python";
// const spawn = require('child_process').spawn;
// const scriptExecution = spawn(pythonExecutable, [myPythonScript,"data1"]);
// scriptExecution.stdout.on("data", function (data) {
//     res.send(data.toString());
//   });

// var options = {
//   args: ["hi",user_id]
// };

// PythonShell.run('bucket-new.py', options, function (err, results) {
//   //if (err) throw err;
//   // results is an array consisting of messages collected during execution
//   console.log('results: %j', results);
// });




http.createServer(app).listen(port, function (err) {
console.log('listening in http://localhost:' + port);
});
