var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sup = [1, 2, 3]

var clients = 0;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('A user connected');
  clients++;
  socket.emit('newclientconnect', { description: 'Hey, welcome!' });
  socket.broadcast.emit('newclientconnect', { description: clients + ' clients connected!' });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
    socket.on('disconnect', function () {
	       clients--;
	         io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
             });
  });

  socket.on('clientEvent', function(data) {
    console.log(data)
  });

});

var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');
  nsp.emit('hi', 'Hello everyone!');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
