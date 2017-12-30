const http = require('http');
const express = require('express');
const socketio = require('socket.io'); //Takes an http server instance
const _ = require('lodash');
const RpsGame = require('./rps.js');


//__dirname points to current path of current module
const clientPath = `${__dirname}/../client`;
console.log(`serving static from ${clientPath}`);

const app = express(); //Our listener function
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

//Matchmaking
let waitingPlayer = null;

//io handles all sockets. Each sock is a single connected socket.
io.on('connection', (sock) => {
  sock.on('disconnect', (reason) => {

  });

  //If there is an existing waiting player
  if (waitingPlayer) {
    //start game
    new RpsGame(waitingPlayer, sock);
    waitingPlayer = null;
  }
  else {
    //Set the just joined player as the waiting player
    waitingPlayer = sock;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  console.log('Someone connected');

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
  console.log('RPS started on 8081 at ' + new Date());
});
