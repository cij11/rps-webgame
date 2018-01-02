const _ = require('lodash');

class Player {

  constructor(socket) {
    this._sock = socket;
    this._id = socket.id;
    this._name = 'Guest-' + Math.floor((Math.random() * 100000) + 100000);

    this._keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };
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

  sendGameState(data) {
    this._sock.emit('newPositions', data);
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

  setKeyPress(event) {
    //Check input event contains an inputId
    var inputId = _.get(event, 'inputId', null);
    if (inputId != null) {
      //Check inputId coresponds to property of _keys object
      if (_.has(this._keys, inputId)) {
        //Set property to state, or false if state not present
        this._keys[inputId] = _.get(event, 'state', false);
      }
    }
  }

  getKeyPress(inputId) {
    return _.get(this._keys, inputId, false);
  }
}

module.exports = Player;
