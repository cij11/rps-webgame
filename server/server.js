"use strict";

const http = require('http');
const express = require('express');
const socketio = require('socket.io'); //Takes an http server instance
const _ = require('lodash');
const RpsGame = require('./rps.js');
const ReadyRoom = require('./ready-room.js');
const Player = require('./player.js');


//__dirname points to current path of current module
const clientPath = `${__dirname}/../client`;
console.log(`serving static from ${clientPath}`);

const app = express(); //Our listener function
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

//Matchmaking
let readyRoomId = 0;
var fillingReadyRoom = new ReadyRoom(readyRoomId);
readyRoomId++;

//io handles all sockets. Each sock is a single connected socket.
io.on('connection', (sock) => {
  var player = new Player(sock);

  //If there a ready room being filled
  if (fillingReadyRoom.isJoinable()) {
    fillingReadyRoom.addPlayer(player);
  }
  else {
    //Set the just joined player as the waiting player
    fillingReadyRoom = new ReadyRoom(readyRoomId);
    readyRoomId++;
    fillingReadyRoom.addPlayer(player);
  }

  console.log('Someone connected');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8081, () => {
  console.log('RPS started on 8081 at ' + new Date());
});
