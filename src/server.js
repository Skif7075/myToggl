var mysql = require('mysql');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var currentTaskDescription;
var currentTaskStartTime;
var isTimerOn = false;

app.set('port', (process.env.PORT || 8081));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '1111',
    database : 'my_toggl'
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected.");
    } else {
        console.log("Error connecting database.");
        console.log(err);
    }
});


app.get('/tasks', function(req, res) {
    var responseValue = {};
    responseValue.time = 0;
    responseValue.timerState = isTimerOn?"on":"off";
    responseValue.currentDescription = currentTaskDescription;
    if (isTimerOn)
    {
        responseValue.time = Math.round((new Date().getTime()-currentTaskStartTime)/1000);
    }
    connection.query('SELECT * from tasks_time', function (err, rows, fields) {
        if (!err){
            responseValue.records = JSON.stringify(rows);
            res.json(responseValue);
        }
        else {
            console.error(err);
            process.exit(1);
        }
    });
});

app.post('/tasks', function(req, res) {
    var responseValue = {};
    if (isTimerOn)
    {
        isTimerOn = false;
        var values = {
            description: currentTaskDescription,
            startTime: currentTaskStartTime,
            endTime: new Date().getTime(),
            duration: Math.round((new Date().getTime()-currentTaskStartTime)/1000)}
        currentTaskDescription = null;
        currentTaskStartTime = null;
        connection.query('INSERT INTO tasks_time SET ?', values, function (err, rows, fields) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
        responseValue.timerState = "off";
    }
    else {
        isTimerOn = true;
        currentTaskDescription = req.body.description;
        currentTaskStartTime = new Date().getTime();
        responseValue.timerState = "on";
    }
    responseValue.currentDescription = currentTaskDescription;
    connection.query('SELECT * from tasks_time', function (err, rows, fields) {
        if (!err){
            responseValue.records = JSON.stringify(rows);
            res.json(responseValue);
        }
        else {
            console.error(err);
            process.exit(1);
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Server started at http://localhost:' + app.get('port') + '/');
});