/* setup express server */

var express = require('express');
var app = express();
var http = require('http').Server(app);
let port = process.env.PORT || 3000;
const fetch = require('node-fetch');

/* setup socket.io */

var io = require('socket.io')(http);

/* handle routing */

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

/* handle chatroom */

io.on('connection', function(socket){

    //check if a username free
    socket.on('username', function(name){
        var free = true;
        for(var i =0; i<usernames.length;i++){
            if(usernames[i] == name.username){
                free = false;
            }
        }
        if(free){
            socket.emit('username!', {datas: name, free: true});
        }
        else{
            socket.emit('username!', {datas: name, free: false});
        }
    })

    //send messages if a user disconneted
    socket.on('disconnect', function(){
        var index = usernames.indexOf(socket.username);
        if(index !== -1) { usernames.splice(index, 1)}
        io.emit('user dcon', {username: socket.username, usernames: usernames });
    });


    /*handle a messages from a client
    global messages, private messages and group messages
    can handle media files*/
    socket.on('chat message', function(data){
        fetch("https://wizardly-swartz.eu-de.mybluemix.net/tone", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'mode': 'cors'
            },
            body: JSON.stringify({
               texts: [data.msg]
            })
        })
        .then((response) => {
            var contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                return response.json();
            }
            throw new TypeError("Oops, we haven't got JSON!");
        })
        .then((response) => { 
            console.log("response:" +  JSON.stringify(response));
            console.log(response.mood);
            var textcolor;
            if(response.mood == 'happy'){
                console.log("---happy");
                textcolor = '#a1ff80';
            }
            else{
                console.log("---unhappy");

                textcolor = '#ff80a1';
            }
    
            /* private messages */  
            if(data.receiver.length != 0){
                var users = [];
                //TODO check empty message
                var id = [];
                var coloru;
                for(var i = 0; i < datauser.length; i++){
                    for(var j =0; j < data.receiver.length; j++){
                        if(datauser[i].username == data.receiver[j]){
                            if(data.receiver[j] != socket.username){
                                console.log(data.receiver[j] + "receiver");
                                console.log(socket.username + "user");
                                id.push(datauser[i].socketid);
                            }
                    }
                    }
                }
                if(id != ''){
                    for(var i =0; i<id.length;i++){
                        io.to(id[i]).emit('chat message3', {username: socket.username, message: data.msg, color: coloru, media: data, textcolor: textcolor});
                    }
                    io.to(socket.id).emit('chat message4', {username: data.receiver, message: data.msg, color: coloru, media: data, textcolor: textcolor});

                  
                }else {
                }
    
                /* group message */
            }else {
                io.emit('chat message2', {media: data, username: socket.username, color: socket.color, textcolor: textcolor});
            }


        })
      
        
        
    });
    //handle a connection from a new user
    socket.on('user con', function (userdata){

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

http.listen(port, function(){
    console.log('listening on *:3000');
});