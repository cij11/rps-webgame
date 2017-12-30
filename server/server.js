const http = require('http');
const express = require('express');
const socketio = require('socket.io'); //Takes an http server instance


//__dirname points to current path of current module
const clientPath = `${__dirname}/../client`;
console.log(`serving static from ${clientPath}`);

const app = express(); //Our listener function
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

//io handles all sockets. Each sock is a single connected socket.
io.on('connection', (sock) => {
  console.log('Someone connected');
  sock.emit('message', 'Hi, you are connected');

  //When I get a message from a single socket...
  sock.on('message', (text) => {
    //Emit to all sockets
    io.emit('message', text);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8081, () => {
  console.log('RPS started on 8081');
});
