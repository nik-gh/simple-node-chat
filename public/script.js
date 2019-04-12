$(function() {
  let socket = io.connect(),
    $messageForm = $("#messageForm"),
    $message = $("#message"),
    $chat = $("#chatWindow"),
    $usernameForm = $("#usernameForm"),
    $users = $("#users"),
    $username = $("#username"),
    $error = $("#error");

  $usernameForm.submit(function(e) {
    e.preventDefault();
    socket.emit("new user", $username.val(), function(data) {
      if (data) {
        $("#namesWrapper").hide();
        $("#mainWrapper").show();
      } else {
        $error.html("Username is already taken");
      }
    });
    $username.val("");
  });

  socket.on("usernames", function(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      html += `${data[i]}<br>`;
    }
    $users.html(html);
  });

  $messageForm.submit(function(e) {
    e.preventDefault();
    socket.emit("send message", $message.val());
    $message.val("");
  });

  socket.on("new message", data => {
    $chat.append(`<strong>${data.user}</strong>: ${data.msg}<br>`);
  });
});
