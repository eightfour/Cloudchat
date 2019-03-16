/* setup express server */

var express = require('express');
var app = express();
var http = require('http').Server(app);

/* setup socket.io */

var io = require('socket.io')(http);

/* handle routing */

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

/* handle chatroom */

io.on('connection', function(socket){
    socket.on('disconnect', function(data){
        io.emit('user dcon', data);
    });
    socket.on('chat message', function(data){
        console.log(socket.username + ': ' + data);
        io.emit('chat message2', {message: data, username: socket.username, color: socket.color});
    });
    socket.on('user con', function (userdata){
        socket.username = userdata.username;
        socket.password = userdata.password;
        socket.color = userdata.color;
        console.table([userdata.username, userdata.password, userdata.color]);
        io.emit('add user', userdata);
      })
    socket.on('names?', function(name){
        console.log('test');
        console.log(name.username + " /test");
        io.local.emit('names!', name);
      })

});

/* http server listens to port 3000 */

http.listen(3000, function(){
    console.log('listening on *:3000');
});