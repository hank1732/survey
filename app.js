var express = require('express');
var app = express();
var util = require('util');

var http = require("http");
var fs = require("fs");

var port = process.argv[2]?process.argv[2]:8000;

app.use(express.static('public'));

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

app.get('/', function(req, res, next) {
    console.log('sendFile');
    var options = {
        root: __dirname + 'public',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = 'index.html';
    res.sendFile(fileName, options, function(err) {
        if (err) {
            console.log("sendIle err! it is ",err);
            console.log("err.code ", err.code);
            console.log("res.statusCode ", res.statusCode);
            if (err.code === "ECONNABORTED" && (res.statusCode === 304 || res.statusCode == 200)) {
                // No problem, 304 means client cache hit, so no data sent.
                console.log('304 cache hit for ' + fileName);
                return;
            }
            // res.status(err.status).end();
        } else {
            console.log('start survey');
        }
    });
});

app.all('/gitpull', function(req, res, next) {
    if (!isValidate(req)){
        res.send('bad post');
        return ;
    }
    console.log('gitpull \t' + util.inspect(Date()));
    var exec = require('child_process').exec; 
    var cmdStr = 'git pull --no-edit';
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            res.write('stderr: ' + util.inspect(stderr));
            console.log('stderr: ' + util.inspect(stderr));
        } else {
            res.write('stdout :' + util.inspect(stdout));
            console.log('git pull: ', util.inspect(stdout) , 'time:' , util.inspect(getTime()));
        }
        res.end();
    });
    function isValidate (req) {
        if( req.body.pusher === undefined){
            return false;
        }
        var pusherName = req.body.pusher.name;
        var pusherEmail = req.body.pusher.email;
        if (pusherName === 'hank1732' && pusherEmail === 'dhuhank@foxmail.com'){
            return true;
        }else{
            return false;
        }
    }
});





