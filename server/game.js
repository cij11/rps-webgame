const _ = require('lodash');
const Unit = require('./unit.js');
const Player = require('./player.js');

class Game {
  constructor (players) {
    this._players = players;
    this._units = null;

    var self = this;


    //Define main game loop
    var loop = function() {
      self._updateGameState();
      self._sendGameState();
      setTimeout(loop, 1000/40);
    }

    self._initializeGame();
    console.log(this._units);
    //Begin main game loop
    setTimeout(loop, 50);
  }

  /*
    Setup the game
  */
  _initializeGame() {
    this._units = this._createUnits(this._players);
  }

  /*
    For each player, create a unit.
    Assign the unit to be controlled by that player.
  */
  _createUnits(players) {
    return _.map(players, player => {
      return new Unit(30, 30, player);
    });
  }

  /*
    Perform game logic
  */
  _updateGameState() {
    _.forEach(this._units, unit => {
      unit.readInput();
      unit.update();
    })
  }

  /*
    Send current game state to each player
  */
  _sendGameState() {
    var unitInfo = _.map(this._units, unit => {
      return unit.getRenderingData();
    });

    var data = {
      units: unitInfo
    };

    _.forEach(this._players, player => {
      player.sendGameState(data);
    });
  }
}

module.exports = Game;
