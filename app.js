// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/test.html');
});

io.on('connect', function(client){
    console.log('client connected');

    client.on('join', function(data){
        console.log(data);
        //client.emit('messages', 'Hello from server');
    })

    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });
})
server.listen(3000);