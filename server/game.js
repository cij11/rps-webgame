const _ = require('lodash');
const Unit = require('./unit.js');
const Player = require('./player.js');

class Game {
  constructor (players) {
    this._players = players;
    this._units = null;

    this._mapW = 20;
    this._mapH = 20;
    this._tileSize = 40

    this._map;

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
    this._map  = this._generateMap(this._mapW, this._mapH);
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
    Create a map. 0 is an empty tile
  */
   _generateMap(mapW, mapH) {
     var map = [];
      for (var j = 0; j < mapH; j++) {
        var row = [];
        for (var i = 0; i < mapW; i++) {
          if (Math.random() < 0.8) {
            row.push(0);
          }
          else {
            row.push(1);
          }
        }
        map.push(row);
      }
      console.log(map);
      return map;
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
      units: unitInfo,
      map: this._map
    };

    _.forEach(this._players, player => {
      player.sendGameState(data);
    });
  }
}

module.exports = Game;
