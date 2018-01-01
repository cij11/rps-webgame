/*
  Ready rooms fill with players as they join the Server
*/

const _ = require('lodash');

class ReadyRoom {

  constructor(id) {
      this._id = id;
      this._maxPlayers = 3;
      this._players = [];
  }

  addPlayer(player) {
    this._players.push(player);

    // Register messaging.
    // Once a message is recieved from client, send to all players in this
    // ready room.
    player.on('message', text => this.messagePlayers(text));
    this.messagePlayers(`Player joined room ${this._id}. Players in Room: ${this.getPlayerCounter()}`);

    console.log('Player joined room: ' + this._id);

    this._logPlayers();

    player.on('disconnect', reason => {
      _.remove(this._players, function(existingPlayer) {
        return existingPlayer.id == player.id;
      });
      console.log(`Player: ${player.id} left room: ${this._id}`);
      this.messagePlayers(`Player left room ${this._id}. Players in Room: ${this.getPlayerCounter()}`);
    });
  }

  getPlayerCounter() {
    return this._players.length;
  }

  isFull() {
    return this._players.length >= this._maxPlayers;
  }

  _logPlayers(){
    _.forEach(this._players, player => {
      console.log(player.id);
    });
  }

  messagePlayers(msg) {
    _.forEach(this._players, player => {
      player.emit('message', msg);
    })
  }
}

module.exports = ReadyRoom;
