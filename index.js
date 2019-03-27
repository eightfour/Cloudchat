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
    socket.on('chat message img', function(data){
        io.emit('chat message2', {username: socket.username, img: data});

    });

    socket.on('chat message', function(data){
        /* private message */
        if((data.msg.charAt(0) ==  '\\') && (data.msg.charAt(1) == 'p') && (data.msg.charAt(2) == ' ')){
            //TODO check empty message
            var data1 = data.msg.split(' ');
            var usernamepriv = data1[1];
            var messagepriv = '';
            var id = '';
            var coloru = '';
            for(var i = 2; i < data1.length; i++){
                messagepriv += data1[i] + ' ';
            }
            for(var i = 0; i < datauser.length; i++){
                if(datauser[i].username == usernamepriv){
                    id = datauser[i].socketid;
                    coloru = datauser[i].color;
                    console.log(id + coloru);
                }
            }
            if(id != ''){
                io.to(id).emit('chat message3', {username: socket.username, message: messagepriv, color: coloru, img: data});
                io.to(socket.id).emit('chat message4', {username: usernamepriv, message: messagepriv, color: coloru, img: data});
            }else {
            }

            /* group message */
        }else if((data.msg.charAt(0) ==  '\\') && (data.msg.charAt(1) == 'g')){
            //TODO forbidd brackets in user names (and additional things...)
            // \g (hallo, bla bla)
            var data2 = data.split(' (');
            var msg = '';
            for(var i = 1; i < data2.length; i++){
                if(i != (data2.length - 1)){
                    msg += data2[i] + ' (';
                }else{
                    msg += data2[i];
                }
                
            }
            console.log(msg + "rksfjhrkjfzhrf");
            data2[1] = msg;
            var data3 = data2[1].split(') ');
            var groupnames = data3[0];
            var groupmessage = '';
            for(var i = 1; i < data3.length; i++){
                if(i != (data3.length - 1)){
                    groupmessage += data3[i] + ') ';
                }else{
                    groupmessage += data3[i];
                }
                
            }
            console.log(data + '\n');
            console.log(groupnames + '\n');
            console.log(groupmessage + '\n');
            var groupnames2 = [];
            var validgroupnames = [];
            var groupids = [];
            groupnames2 = groupnames.split(', ');
            console.log(groupnames2);
            for(var i = 0; i < groupnames2.length; i++ ){
                for(var j = 0; j < datauser.length; j++ ){
                    if(groupnames2[i] == datauser[j].username && groupnames2[i] !== socket.username){
                        validgroupnames.push(groupnames2[i]);
                        groupids.push(datauser[j].socketid);
                    }
                }
            }
           // var groupsnstring = validgroupnames.toString
           if(groupnames2.length == validgroupnames.length){
            for(var i = 0; i < groupids.length; i++){
                //TODO colors for everyone
                io.to(groupids[i]).emit('chat message5', {username: validgroupnames.toString() + "," + socket.username, message: groupmessage, color: socket.color});
            }
            io.to(socket.id).emit('chat message5', {username: validgroupnames.toString() + "," + socket.username, message: groupmessage, color: socket.color});        
            }
            else{
            io.to(socket.id).emit('chat message2', {message: "groupmessage failed, dont use your own name and check all names", username: socket.username, color: socket.color});
            }
            /* message */
        }else {
            io.emit('chat message2', {message: data, username: socket.username, color: socket.color});
        }
        
        
    });
    socket.on('user con', function (userdata){
        //TODO delete whitespaces from username
        //TODO unique username
        usernames.push(userdata.username);
        passwords.push(userdata.password);
        colors.push(userdata.color);
        ids.push(socket.id);

        var userdatafull = JSON.parse(JSON.stringify(userdata).replace('}',' ') + ',"socketid":"' + socket.id + '"}');
        socket.username = userdata.username;
        socket.color = userdata.color;
        datauser.push(userdatafull);

        io.emit('add user', {usernames: usernames, username: userdata.username} );
      })

});

    /* Data */
    var datauser = [];
    var usernames = [];
    var passwords = [];
    var colors = [];
    var ids = [];

/* http server listens to port 3000 */

http.listen(3000, function(){
    console.log('listening on *:3000');
});