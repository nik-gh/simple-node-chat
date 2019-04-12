const express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  usernames = [];

app.use(express.static(`${__dirname}/public`));

server.listen(process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Update usernames
function updateUsernames() {
  io.sockets.emit("usernames", usernames);
}

io.sockets.on("connection", socket => {
  socket.on("new user", (data, callback) => {
    if (usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  // Send Message
  socket.on("send message", data => {
    io.sockets.emit("new message", {
      msg: data,
      user: socket.username
    });
  });

  // Disconnect
  socket.on("disconnect", data => {
    if (!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});
