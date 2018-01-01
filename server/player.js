const _ = require('lodash');

class Player {

  constructor(socket) {
    this._sock = socket;
    this._id = socket.id;
    this._name = 'Guest-' + Math.floor((Math.random() * 100000) + 100000);
  }

  getSocket() {
    return this._sock;
  }

  getId() {
    return this._id;
  }

  messagePlayer(msg) {
    this._sock.emit('message', msg);
  }

  sendGameState() {
    this._sock.emit('newPositions', {
      x: 30,
      y: 30
    });
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  sendPlayerNameList(playerNameList) {
    this._sock.emit('update-names', playerNameList);
  }
}

module.exports = Player;
