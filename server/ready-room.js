/*
  Ready rooms fill with players as they join the Server
*/

const _ = require('lodash');

class ReadyRoom {

  constructor(id) {
      this._id = id;
      this._maxPlayers = 3;
      this._players = [];
      this._isGameStarted = false;
  }

  addPlayer(player) {
    this._players.push(player);

    var sock = player.getSocket();

    // Register messaging.
    // Once a message is recieved from client, send to all players in this
    // ready room.
    sock.on('message', text => this.messagePlayers(text));
    this.messagePlayers(`Player joined room ${this._id}.`);
    this.sendPlayerNameList();

    console.log('Player joined room: ' + this._id);
    this.sendPlayerNameList();

    this._logPlayers();

    sock.on('disconnect', reason => {
      _.remove(this._players, function(existingPlayer) {
        return existingPlayer.getId() == sock.id;
      });
      console.log(`Player: ${player.id} left room: ${this._id}`);
      this.messagePlayers(`Player left room ${this._id}.`);
      this.sendPlayerNameList();
    });

    sock.on('rename', text => {
      player.setName(text);
      this.sendPlayerNameList();
    })
  }

  getPlayerCounter() {
    return this._players.length;
  }

  _isFull() {
    return this._players.length >= this._maxPlayers;
  }

  isJoinable () {
    return !this._isFull() && !this._isGameStarted;
  }

  _logPlayers(){
    _.forEach(this._players, player => {
      console.log(player.getId());
    });
  }

  messagePlayers(msg) {
    _.forEach(this._players, player => {
      player.messagePlayer(msg);
    })
  }

  sendPlayerNameList() {
    var playerNameList = _.map(this._players, player => {
      return player.getName();
    });

    _.forEach(this._players, player => {
      player.sendPlayerNameList(playerNameList);
    })
  }
}

module.exports = ReadyRoom;
