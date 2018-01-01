import test from 'ava';
const ReadyRoom = require('./ready-room.js');


test(t => {
  var readyRoom = new ReadyRoom();

  var mockPlayer = {};
  mockPlayer.on = function () { return null };
  mockPlayer.emit = function () { return null };

  readyRoom.addPlayer(mockPlayer);
  readyRoom.addPlayer(mockPlayer);

	t.is(2, readyRoom.getPlayerCounter());
});
