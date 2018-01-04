const _ = require('lodash');
const Unit = require('./unit.js');
const Player = require('./player.js');

class Game {
  constructor (players) {
    this._players = players;
    this._units = null;

    this._map = {
      width : 20,
      height : 20,
      tileSize : 20,
      tiles : [],

      getTileAtPixelCoords : function(x, y) {
        var xCoord = Math.floor(x/this.tileSize),
        yCoord = Math.floor(y/this.tileSize);

        if (xCoord >= 0 && xCoord < this.width && yCoord >= 0 && yCoord < this.height) {
          return this.tiles[yCoord][xCoord];
        } else {
          return 0;
        };
      }
    };

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
    this._map.tiles  = this._generateTiles(this._map.width, this._map.height);
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
   _generateTiles(mapW, mapH) {
     var tiles = [];
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
        tiles.push(row);
      }
      console.log(tiles);
      return tiles;
   }

  /*
    Perform game logic
  */
  _updateGameState() {
    _.forEach(this._units, unit => {
      unit.readInput();
      unit.update(this._map);
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
