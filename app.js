var express = require('express');
var app = express();
var util = require('util');
var url  = require('url');

var http = require("http");
var fs = require("fs");
var bodyParser = require('body-parser');

var port = process.argv[2]?process.argv[2]:8088;


var jsonParser = bodyParser.json();

app.use(express.static('public'));
// app.use(bodyParser);

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

app.get('/', function(req, res, next) {
    console.log('sendFile', req.get('host'));
    var options = {
        root: __dirname + '/public',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = 'mainLand.html';
    var host = req.get('host');
    var firstDomainName = host.split('.')[0];
    if(firstDomainName === 'tw'){
        fileName = 'tw.html';
    }
    if(firstDomainName === 'hk'){
        fileName = 'hk.html';
    }
    if(firstDomainName === 'invitation'){
        fileName = 'invitation.html';
    }
    if(firstDomainName === 'invitation-w'){
        fileName = 'invitation-w.html';
    }
    // if(firstDomainName === 'chart'){
        fileName = 'S01/index.html';
    // }

    console.log('fileName', fileName);
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
            console.log('start survey main');
        }
    });
});

app.all('/gitpull', function(req, res, next) {
    console.log('gitpull \t' + util.inspect(Date()));
    var exec = require('child_process').exec; 
    var cmdStr = 'git pull --no-edit';
    exec(cmdStr, function(err,stdout,stderr){
        if(err) {
            res.write('stderr: ' + util.inspect(stderr));
            console.log('stderr: ' + util.inspect(stderr));
        } else {
            res.write('stdout :' + util.inspect(stdout));
        }
        res.end();
    });
});

app.all('/write', jsonParser, function(req, res, next) {
    console.log(req.body);
    var message = '';
    for(var name in req.body){
        message += req.body[name] + '\n';
    }
    message = '\n' + new Date() + '\n' + message + '\n\n';
    console.log('message', message);
    fs.appendFile('data.txt', message, function (err) {
        if (err) return console.log(err);
        res.send('date received');
    });
});

app.all('/db', function(req, res, next) {
    var dbname = 'data.txt';
    var stat = fs.statSync(dbname);
    res.writeHeader(200, {
        "Content-Length": stat.size,
        'Content-disposition': 'attachment; filename=' + dbname
    });
    var fReadStream = fs.createReadStream(dbname);
    fReadStream.pipe(res);
});





