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

    socket.on('disconnect', function(){
        console.table(usernames);
        var index = usernames.indexOf(socket.username);
        if(index !== -1) { usernames.splice(index, 1)}
        io.emit('user dcon', {username: socket.username, usernames: usernames });
        console.table(usernames);
    });
    socket.on('chat message', function(data){
        io.emit('chat message2', {message: data, username: socket.username, color: socket.color});
    });
    socket.on('user con', function (userdata){
        socket.username = userdata.username;
        socket.color = userdata.color;
        usernames.push(userdata.username);
        passwords.push(userdata.password);
        colors.push(userdata.color);
        io.emit('add user', {usernames: usernames, username: userdata.username} );
      })

});

    /* Data */

    var usernames = [];
    var passwords = [];
    var colors = [];

/* http server listens to port 3000 */

http.listen(3000, function(){
    console.log('listening on *:3000');
});