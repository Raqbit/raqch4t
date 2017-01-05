var socket = io();

$('#messages').append($('<li>').text('Joined the chat room.'));

$('form').submit(function(){
  var msg = $('#m').val();
  if(msg.startsWith("/")) {
    var args = msg.split(' ');
    var cmd = args[0].substring(1);

    if(cmd == "nick"){
      if(args.length == 2) {
        var nick = args[1];
        socket.emit('nick change', nick);
      }
      else {
        $('#messages').append($('<li>').text('/nick: Invalid use.'));
        $('#messages').append($('<li>').text('/nick: Usage: /nick <New nick>'));
      }
    }
    else if (cmd == "clear") {
      $('#messages').empty();
    }
  }
  else {
    socket.emit('chat message', msg);
  }

  $('#m').val('');
  return false;
});
socket.on('chat message', function(nick, msg){
  $('#messages').append($('<li>').text(nick + ': ' + msg));
});

socket.on('nick change', function(oldNick, newNick){
  $('#messages').append($('<li>').text(oldNick + " changed his name to " + newNick + "."));
});

socket.on('nick change success', function(nick){
  $('#messages').append($('<li>').text("Succesfully changed nick to " + nick + "."));
});

socket.on('nick in use', function(nick)
{
  $('#messages').append($('<li>').text("/nick: " + nick + " is already in use."));
});

socket.on('client connect', function(nick){
  $('#messages').append($('<li>').text(nick + " joined the chatroom."));
});

socket.on('client disconnect', function(nick){
  $('#messages').append($('<li>').text(nick + " left the chatroom."));
});
