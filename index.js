/* setup express server */

var express = require('express');
var app = express();
var http = require('http').Server(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const frameguard = require('frameguard')

// Don't allow me to be in ANY frames:
app.use(frameguard({ action: 'deny' }))
app.use(helmet.noSniff());

//connect to mongodb
mongoose.connect('mongodb://holmma:1q2w3e@ds125241.mlab.com:25241/artist_projekt_vs', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

//inizialisiert routes
app.use('/api',require('./routes/api'));

//error handling middleware
app.use(function(err, req,res,next){
  //console.log(err);
  res.status(422).send({error: err.message});
});



    


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

//console.log(host + service);

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
    //console.log(body.id)
  }else{
      //console.log(error);
     // console.log('HERE BEGINNS THE RESPONSE \n');
      //console.log(response.statusCode);
      //console.log(body);
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

    //add IBM Language Translator

const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01', //2019-04-02
  iam_apikey: 'VPTaIKrsCtLvCMhd16zUxD8hEPAj-abl41pjOnppSfzN',
  url: 'https://gateway-fra.watsonplatform.net/language-translator/api'
});


var globalLanguage;
var msgde = '';
var msgen = '';

function translate(data, messageLanguage){
    datamessage = data.msg;
    var translatedMessage1 = '';
    var translatedMessage2 = '';
    var model = messageLanguage + '-' + globalLanguage;
    console.log(messageLanguage);
    console.log(globalLanguage);

   /* if(messageLanguage == globalLanguage){
        translatedMessage = message;
    }else {
        const translateParams = {
            text: message,
            model_id: model,
            };
            languageTranslator.translate(translateParams)
            .then(translationResult => {
        translatedMessage = translationResult;
        console.log('here the translated message');
        console.log(JSON.stringify(translationResult, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
    });
    } */
    const translateParams1 = {
        text: datamessage,
        model_id: 'en-de',
        };
        const translateParams2 = {
            text: datamessage,
            model_id: 'de-en',
            };
        languageTranslator.translate(translateParams1)
        .then(translationResult => {
    translatedMessage1 = translationResult;
    //console.log('here the translated message1');
    //console.log(JSON.stringify(translationResult, null, 2));
    languageTranslator.translate(translateParams2)
    .then(translationResult => {
translatedMessage2 = translationResult;
//console.log('here the translated message2');
//console.log('here the tm1');
//console.log(translatedMessage1.translations[0].translation);
msgde = translatedMessage1.translations[0].translation;
//console.log(msgde);
//console.log('here the tm2');
//console.log(translatedMessage2.translations[0].translation);
msgen = translatedMessage2.translations[0].translation;
//console.log(msgen);
//
//console.log(data);
doMessage2(data, msgde, msgen);

//
//console.log(JSON.stringify(translationResult, null, 2))
;})
//.catch(err => {
  //  console.log('error:', err);
//});

})
   // .catch(err => {
       // console.log('error:', err);
   // });

    
    }


    function doMessage(data){
        translate(data, globalLanguage);
    }
    function doMessage2(data, msgde, msgen ){
       
        console.log('here the message');
        console.log(data);
       // translate(data.msg, globalLanguage);
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
           // console.log("response:" +  JSON.stringify(response));
            //console.log(response.mood);
            var textcolor;
            if(response.mood == 'happy'){
               // console.log("---happy");
                textcolor = '#a1ff80';
            }
            else{
               // console.log("---unhappy");

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
                                //console.log(data.receiver[j] + "receiver");
                                //console.log(socket.username + "user");
                                id.push(datauser[i].socketid);
                            }
                    }
                    }
                }
                if(id != ''){
                    for(var i =0; i<id.length;i++){
                        io.to(id[i]).emit('chat message3', {username: socket.username, message: data.msg, color: coloru, media: data, textcolor: textcolor, language: data.language, msgdev: msgde, msgenv: msgen});
                    }
                    io.to(socket.id).emit('chat message4', {username: data.receiver, message: data.msg, color: coloru, media: data, textcolor: textcolor, language: data.language, msgdev: msgde, msgenv: msgen});

                  
                }else {
                }
    
                /* group message */
            }else {
                io.emit('chat message2', {media: data, username: socket.username, color: socket.color, textcolor: textcolor, language: data.language, msgdev: msgde, msgenv: msgen});
            }


        })
      
        
        
    }


    /*handle a messages from a client
    global messages, private messages and group messages
    can handle media files*/
    socket.on('chat message', function(data){
        doMessage(data);
       /* doMessage(data);
        console.log('here the message');
        console.log(data.msg);
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
    
            /* private messages */  /*
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
                        io.to(id[i]).emit('chat message3', {username: socket.username, message: data.msg, color: coloru, media: data, textcolor: textcolor, language: data.language});
                    }
                    io.to(socket.id).emit('chat message4', {username: data.receiver, message: data.msg, color: coloru, media: data, textcolor: textcolor, language: data.language});

                  
                }else {
                }
    
                /* group message */ /*
            }else {
                io.emit('chat message2', {media: data, username: socket.username, color: socket.color, textcolor: textcolor, language: data.language});
            }


        })
      
        */
        
    });
    //handle a connection from a new user
    socket.on('user con', function (userdata){
        usernames.push(userdata.username);
        passwords.push(userdata.password);
        pictures.push(userdata.profilePicture);
        colors.push(userdata.color);
        ids.push(socket.id);
        globalLanguage = userdata.language;
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