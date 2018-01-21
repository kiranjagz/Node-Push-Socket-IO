var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
 
var mySocket = 0; 
app.listen(3000); 
 
function handler (req, res) {
  fs.readFile(__dirname + '/chat.html', //Load and display outputs to the index.html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
 
io.sockets.on('connection', function (socket, username) {
  mySocket = socket;
  console.log('Web browser connected with Id: ' + mySocket.id); //Confirmation that the socket connected
  socket.emit('message', 'You are connected!');
  socket.broadcast.emit('message', 'Another client has just connected! ' + username);

    // As soon as the username is received, it's stored as a session variable
    socket.on('little_newbie', function(username) {
        socket.username = username;
        console.log(username);
    });

        socket.on('messages', function(data) {
        console.log(data);
        socket.emit('broad', data);
        socket.broadcast.emit('broad',data);
    });
});

 
//UDP server on 41181
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
 
server.on("message", function (msg, rinfo) {
  console.log("Broadcasting Message: " + msg); //Display the message coming from the terminal to the command line for debugging
  if (mySocket != 0) {
     mySocket.emit('field', "" + msg);
     mySocket.broadcast.emit('field', "" + msg); //Display the message from the terminal to the webpage
  }
});
 
server.on("listening", function () {
  var address = server.address(); //IPAddress of the server
  console.log("UDP server listening to " + address.address + ":" + address.port);
});
 
server.bind(41181);