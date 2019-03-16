var usernameInput = $('#loginname');
var passwordInput = $('#loginpw');
var color;
var socket = io();

/* wrap functionality */

$(function () {

    /* handle message */
    
    $('#typeform').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#typeforminput').val());
      $('#typeforminput').val('');
      return false;
    });

    /* print message */

    socket.on('chat message2', function(data){
     var timeStamp = actualDate();
     console.table([data]);
      $('#messages').append($('<li><span class="userName">' + data.username +'</span><span class="timeStamp"> at ' + timeStamp +'</span></li>'));
      $('.userName').css('color', color);
      $('#messages').append($('<li>').text(data.message));
      scroll();
    });

    /* print connect-message */

    socket.on('add user', function(usernameV){
      addUserNameToDiv(usernameV.username);
      $('#messages').append($('<li>').text(usernameV.username + ' connected'));
      scroll();
    });

    /* print disconnect-message */

    socket.on('user dcon', function(usernameV){
      $('#messages').append($('<li>').text(usernameV.username + ' disconnected'));
      scroll();
    });

    socket.on('names!', function(usernameVV){
      var l = document.querySelectorAll("#users li").length;
      console.log(usernameVV.username);
      //if(l == 0) {
        console.log('yes');
        addUserNameToDiv(usernameVV.username);
        scroll();
     // }else {
        console.log('nope');
      //}
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
  
    if(username) { //TODO check PW null
      fadeOutLoginPage(elementId);
      colorUsername();
      socket.emit('user con', { username: username, password: password, color: color });
      socket.emit('names?', {username: username});
    }else {
      console.log('login failed: see login function');
    }
}


// TODO add to list
function addUserNameToDiv(usernameV){
  $('#users').append($('<li class="userList"><span class="userName">' + usernameV + '</span></li>'));
  $('.userName').css('color', color);
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
