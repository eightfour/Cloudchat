/* setup express server */

var express = require('express');
var app = express();
var http = require('http').Server(app);
let port = process.env.PORT || 3000;
const fetch = require('node-fetch');

var db2id = {
    "hostname": "dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net",
    "password": "hrqg1zqq1vn+s3l1",
    "https_url": "https://dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net:8443/",
    "port": 50000,
    "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=jkh27781;PWD=hrqg1zqq1vn+s3l1;Security=SSL;",
    "host": "dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net",
    "jdbcurl": "jdbc:db2://dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net:50000/BLUDB",
    "uri": "db2://jkh27781:hrqg1zqq1vn%2Bs3l1@dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net:50000/BLUDB",
    "db": "BLUDB",
    "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=jkh27781;PWD=hrqg1zqq1vn+s3l1;",
    "username": "jkh27781",
    "ssljdbcurl": "jdbc:db2://dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net:50001/BLUDB:sslConnection=true;"
  }

var db2_https_url = db2id.https_url;
var db2_username= db2id.username;
var db2_password = db2id.password;

var api = '/dbapi/v3';
var host = db2_https_url + api;

var userinfo = {
    'userid': db2_username,
    'password': db2_password
}
var service = '/auth/tokens';

var request = require('request');

console.log(host + service);

var options = {
  uri: host + service,
  method: 'POST',
  json: 'true',
  userinfo: {
    'userid': db2_username,
    'password': db2_password
    }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body.id)
  }else{
      //console.log(error);
      console.log('HERE BEGINNS THE RESPONSE \n');
      console.log(response.statusCode);
      console.log(body);
  }
});

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
        if(index !== -1) { 
            usernames.splice(index, 1);
            pictures.splice(index, 1);

        }
        io.emit('user dcon', {username: socket.username, usernames: usernames, pictures: pictures });
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
        pictures.push(userdata.profilePicture);
        colors.push(userdata.color);
        ids.push(socket.id);

        var userdatafull = JSON.parse(JSON.stringify(userdata).replace('}',' ') + ',"socketid":"' + socket.id + '"}');
        socket.username = userdata.username;
        socket.color = userdata.color;
        datauser.push(userdatafull);

        io.emit('add user', {usernames: usernames, username: userdata.username, pictures: pictures} );
      })

});

    /* Data */
    var datauser = [];
    var usernames = [];
    var passwords = [];
    var pictures = [];
    var colors = [];
    var ids = [];

/* http server listens to port 3000 */

http.listen(port, function(){
    console.log('listening on *:3000');
});