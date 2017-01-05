var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentUsers = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/js/chat.js', function(req, res){
  res.sendFile(__dirname + '/client/js/chat.js')
});

io.sockets.on('connection', function(client){
  currentUsers[client.id] = {socket: client};

  currentUsers[client.id].nick = "User_" + Object.keys(currentUsers).length;

  client.broadcast.emit('client connect', currentUsers[client.id].nick);
  console.log(currentUsers[client.id].nick + " joined the chatroom.")

  client.on('chat message', function(msg){
    io.emit('chat message', currentUsers[client.id].nick, msg);
    console.log(currentUsers[client.id].nick + ": " + msg);
  });

  client.on('nick change', function(newNick){
    if(!nickAlreadyInUse(newNick)){
      var oldNick = currentUsers[client.id].nick;
      client.broadcast.emit('nick change', oldNick, newNick);
      console.log(oldNick + ' changed his name to ' + newNick + '.')
      currentUsers[client.id].nick = newNick;
      client.emit('nick change success', newNick);
    }
    else {
      client.emit('nick in use', newNick);
    }

  });

  client.on('disconnect', function() {
    client.broadcast.emit('client disconnect', currentUsers[client.id].nick);
    console.log(currentUsers[client.id].nick + " left the chatroom.")
    delete currentUsers[client.id];
  });
});

http.listen(3000, function(){
  console.log('Serving to http://localhost:3000.');
  console.log('---------------------------------');
});

function nickAlreadyInUse(nick) {
  for(var key in currentUsers) {
    if(currentUsers.hasOwnProperty(key)) {
      if(currentUsers[key].nick == nick) {
        return true;
      }
    }
  }
  return false;
}
