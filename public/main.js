var usernameInput = $('#loginname');
var passwordInput = $('#loginpw');
var color;
var socket = io();
var user = false;

/* wrap functionality */

$(function () {

    /* handle message */
    
    $('#typeform').submit(function(e){
      e.preventDefault(); // prevents page reloading
      if($('#typeforminput').val()){
        socket.emit('chat message', {msg: $('#typeforminput').val()});
        $('#typeforminput').val('');
      }
      return false;
    });

    socket.on('username!', function(data){
      console.log("free: " + data.free);
      if(data.free== true){
        user = true;
        login2(data);
      }
    })
    /* global message */
    socket.on('chat message2', function(data){
      var timeStamp = actualDate();
      if(data.media.hasOwnProperty('mp3')){
        
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = data.media.mp3;
        console.log(audio);
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(audio);
        $('#messages').append($('<li>').text(data.media.msg));
      }
      else if(data.media.hasOwnProperty('mp4')){
        console.log(data);
        var mp4 = document.createElement('video');
        mp4.height = 400;
        mp4.width = 800
        mp4.controls = true;
        mp4.src = data.media.mp4;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(mp4);
        $('#messages').append($('<li>').text(data.media.msg));
      }
      else if(data.media.hasOwnProperty('img')){
        console.log(data);
        var img = document.createElement('img');
        img.height = 200;
        img.width = 200;
        img.src = data.media.img;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(img);
        $('#messages').append($('<li>').text(data.media.msg));
      }
      else{
        $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append($('<li>').text(data.media.msg));
      }
      scroll();
    });

     //private msg who resive ist
    socket.on('chat message3', function(data){
      var timeStamp = actualDate();
      if(data.media.hasOwnProperty('mp3')){
        
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = data.media.mp3;
        console.log(audio);
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName" > Private from: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(audio);
        $('#messages').append($('<li>').text(data.message));
      }
      else if(data.media.hasOwnProperty('mp4')){
        console.log(data);
        var mp4 = document.createElement('video');
        mp4.height = 400;
        mp4.width = 800
        mp4.controls = true;
        mp4.src = data.media.mp4;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName"> Private from: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(mp4);
        $('#messages').append($('<li>').text(data.message));
      }
      else if(data.media.hasOwnProperty('img')){
        console.log(data);
        var img = document.createElement('img');
        img.height = 200;
        img.width = 200;
        img.src = data.media.img;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName"> Private from: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(img);
        $('#messages').append($('<li>').text(data.message));
      }
      else{
        $('#messages').append($('<li><span class="userName"> Private from: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append($('<li>').text(data.message));
      }
      scroll();
     });



     socket.on('chat message4', function(data){
      var timeStamp = actualDate();
      if(data.media.hasOwnProperty('mp3')){
        
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = data.media.mp3;
        console.log(audio);
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName"> Private to: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(audio);
        $('#messages').append($('<li>').text(data.message));
      }
      else if(data.media.hasOwnProperty('mp4')){
        console.log(data);
        var mp4 = document.createElement('video');
        mp4.height = 400;
        mp4.width = 800
        mp4.controls = true;
        mp4.src = data.media.mp4;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName"> Private to: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(mp4);
        $('#messages').append($('<li>').text(data.message));
      }
      else if(data.media.hasOwnProperty('img')){
        console.log(data);
        var img = document.createElement('img');
        img.height = 200;
        img.width = 200;
        img.src = data.media.img;
        //var location = document.getElementById('messages');
        $('#messages').append($('<li><span class="userName"> Private to: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append(img);
        $('#messages').append($('<li>').text(data.message));
      }
      else{
        $('#messages').append($('<li><span class="userName"> Private to: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
        $('.userName').css('color', data.color);
        $('#messages').append($('<li>').text(data.message));
      }
      scroll();
     });


     //group msg
     socket.on('chat message5', function(data){
      var timeStamp = actualDate();
       $('#messages').append($('<li><span class="userName">Group with: ' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
       $('.userName').css('color', data.color);
       $('#messages').append($('<li>').text(data.message));
       scroll();
     });


     //send img global with a message
/*      socket.on('chat message img 2', function(data){
      console.log(data);
      var img = document.createElement('img');
      img.height = 200;
      img.width = 200;
      img.src = data.img.img;
      //var location = document.getElementById('messages');
      var timeStamp = actualDate();
      $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
      $('.userName').css('color', data.color);
      $('#messages').append(img);
      $('#messages').append($('<li>').text(data.img.msg));
      scroll(); 
     });*/

     

    /* print connect-message */

    socket.on('add user', function(data){
      clearUserList();
      for(var i = 0; i < data.usernames.length; i++){
        addUserNameToDiv(data.usernames[i]);
      }
      $('#messages').append($('<li>').text(data.username + ' connected'));
      scroll();
    });

    /* print disconnect-message */

    socket.on('user dcon', function(data){
      $('#messages').append($('<li>').text(data.username + ' disconnected'));
      scroll();
      clearUserList();
      for(var i = 0; i < data.usernames.length; i++){
        addUserNameToDiv(data.usernames[i]);
      }

    });
  });

  /* scrolls to actual message */

  function scroll() {
    var elem = document.getElementById('messagediv');
    elem.scrollTop = elem.scrollHeight;
  }

  /* color username */

  function colorUsername(){
    var colors = ['#ff99e6', '#c299ff', '#9999ff', '#e6ff99', '#adebad', '#99ffd6'];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    color = random_color;
  }

  /* handle date */

  function actualDate(){
    var d = new Date();
    var year = (d.getFullYear()).toString();
    var month = parseDate(d.getMonth() + 1);
    var day = parseDate(d.getDate());
    var hour = parseDate(d.getHours());
    var minute = parseDate(d.getMinutes());
    var now = day + '.' + month + '.' + year + ', ' + hour + ':' + minute;
    return now;
  }

  /* helper-function to handle date */

  function parseDate(date){
    if(date < 10){
      return date = '0' + date.toString();
    }else {
     return date = date.toString();
    }
  }

  /* handel login-process */

  function login(elementId){
    username = usernameInput.val().trim();
    password = passwordInput.val().trim();
    socket.emit('username', {username: username, password: password, color: color, loginpage : elementId});
}

function login2(datas){
  console.log(datas);
  if(user && datas.datas.username && datas.datas.password && !datas.datas.username.includes('\\')&& !datas.datas.username.includes('(')&& !datas.datas.username.includes(')') && !datas.datas.username.includes(' ')) { //TODO check PW null
    fadeOutLoginPage(datas.datas.loginpage);
    colorUsername();
    socket.emit('user con', { username: datas.datas.username, password: datas.datas.password, color: datas.datas.color });
  }else {
    console.log('login failed: see login function');
  }
}


function addUserNameToDiv(usernameV){
  $('#users').append($('<li class="userList"><span class="userName">' + usernameV + '</span></li>'));
  $('.userName').css('color', color);
}

function clearUserList(){
  $('#users').empty();
}

  /* handle fade out of loginpage */

function fadeOutLoginPage(elementId){
  var element = document.getElementById(elementId);
  $('#' + elementId).fadeOut();
  $('#typeforminput').focus();
}

  /* prevent page reloading for login form */

  $('#loginform').submit(function(e) {
    e.preventDefault();
    return false;
 });

 $("a").click(function() {
  var input = document.createElement('input');
  input.type = 'file';
  
  input.onchange = e => { 
  
     // getting a hold of the file reference
     var file = e.target.files[0]; 
     console.log(file.type);
     // setting up the reader
     var reader = new FileReader();
     if (file.type == 'image/jpeg'){
     reader.readAsDataURL(file);
     // here we tell the reader what to do when it's done reading...
     reader.onload = readerEvent => {
        var content = readerEvent.target.result; // this is the content!
        console.log(username);
        socket.emit('chat message',{msg: $('#typeforminput').val(), img: content});
        $('#typeforminput').val('');
     }
    }
    else if(file.type == 'audio/mp3'){
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
         var content = readerEvent.target.result; // this is the content!
         console.log(username);
         socket.emit('chat message',{msg: $('#typeforminput').val(), mp3: content});
         $('#typeforminput').val('');
      }
    }
    else if(file.type == 'video/mp4'){
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
         var content = readerEvent.target.result; // this is the content!
         console.log(username);
         socket.emit('chat message',{msg: $('#typeforminput').val(), mp4: content});
         $('#typeforminput').val('');
    }
  };
}  
input.click();
});