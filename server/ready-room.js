/*
  Ready rooms fill with players as they join the Server
*/

const _ = require('lodash');

class ReadyRoom {

  constructor(id) {
      this._id = id;
      this._maxPlayers = 1;
      this._players = [];
      this._isGameStarted = false;


      //Game variables. Pull these out into separate class after prototyping
      this._framerate = 1;
      this._frameDelay = 1000/this._framerate;
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
    });

    sock.on('keyPress', event => {
      player.setKeyPress(event);
    });

    //Main loop
    var self = this;
    var loop = function() {
      self.updateGameState();
      self.sendGameState();
      setTimeout(loop, 100);
    }

    if (this._isFull()) {
      this._isGameStarted = true;
      setTimeout(loop, 100);
    }
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
    });
  }

  sendGameState() {
    var playerUnits = _.map(this._players, player => {
      return player.getUnit();
    });

    var data = {
      units: playerUnits
    };

    _.forEach(this._players, player => {
      player.sendGameState(data);
    });
  }

  sendPlayerNameList() {
    var playerNameList = _.map(this._players, player => {
      return player.getName();
    });

    _.forEach(this._players, player => {
      player.sendPlayerNameList(playerNameList);
    });
  }

  updateGameState() {
    _.forEach(this._players, player => {
      player.update();
    })
  }

}

module.exports = ReadyRoom;
