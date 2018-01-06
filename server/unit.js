const _ = require('lodash');
const Player = require('./player.js');

class Unit {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.halfWidth = 10;

    this.xdir = 1;
    this.ydir = 0;
    this.speed = 1;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }

  getRenderingData() {
    return {
      position: this.getPosition(),
      halfWidth: this.halfWidth
    }
  }

  readInput() {
      if (this.player.getKeyPress('up')){
        this.setYdir(-1);
      } else if (this.player.getKeyPress('down')) {
        this.setYdir(1);
      } else {
        this.setYdir(0);
      }

      if (this.player.getKeyPress('left')){
        this.setXdir(-1);
      } else if (this.player.getKeyPress('right')) {
        this.setXdir(1);
      } else {
        this.setXdir(0);
      }
  }

  update(map) {
    this._updatePosition(map);
  }

  _updatePosition(map) {
    this.x = this.x + this.xdir * this.speed,
    this.y = this.y + this.ydir * this.speed;

    this._resolveTileOverlaps(map);
  }

  _resolveTileOverlaps(map) {
    var unitCoords = map.getPixelCoords(this.x, this.y);

    //Edge collisions
    var leftTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y);
    if (leftTileType != 0){
      var leftTileEdge = unitCoords.x * map.tileSize;
      var leftCircleEdge = this.x - this.halfWidth;
      var overlap = leftTileEdge - leftCircleEdge;
      if (overlap > 0) {
        this.x = this.x + overlap;
      }
    }

    var rightTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y);
    if (rightTileType != 0){
      var rightTileEdge = (unitCoords.x + 1)* map.tileSize;
      var rightCircleEdge = this.x + this.halfWidth;
      var overlap = rightTileEdge - rightCircleEdge;
      if (overlap < 0) {
        this.x = this.x + overlap;
      }
    }

    var upTileType = map.getTileTypeByTileCoords(unitCoords.x, unitCoords.y - 1);
    if (upTileType != 0){
      var upTileEdge = unitCoords.y * map.tileSize;
      var upCircleEdge = this.y - this.halfWidth;
      var overlap = upTileEdge - upCircleEdge;
      if (overlap > 0) {
        this.y = this.y + overlap;
      }
    }

    var downTileType = map.getTileTypeByTileCoords(unitCoords.x, unitCoords.y + 1);
    if (downTileType != 0){
      var downTileEdge = (unitCoords.y + 1)* map.tileSize;
      var downCircleEdge = this.y + this.halfWidth;
      var overlap = downTileEdge - downCircleEdge;
      if (overlap < 0) {
        this.y = this.y + overlap;
      }
    }

    //Corner collisions
    var nwTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y - 1);
    if (nwTileType != 0) {
      var cornerX = unitCoords.x * map.tileSize;
      var cornerY = unitCoords.y * map.tileSize;

      var xDisp = this.x - cornerX;
      var yDisp = this.y - cornerY;

      var dist = Math.sqrt(xDisp * xDisp + yDisp * yDisp);

      var overlap = this.halfWidth - dist;
      if (overlap > 0) {
        var ratio = overlap / dist;

        this.x = this.x + ratio * xDisp;
        this.y = this.y + ratio * yDisp;
      }
    }

    var neTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y - 1);
    if (neTileType != 0) {
      var cornerX = (unitCoords.x + 1) * map.tileSize;
      var cornerY = unitCoords.y * map.tileSize;

      var xDisp = this.x - cornerX;
      var yDisp = this.y - cornerY;

      var dist = Math.sqrt(xDisp * xDisp + yDisp * yDisp);

      var overlap = this.halfWidth - dist;
      if (overlap > 0) {
        var ratio = overlap / dist;

        this.x = this.x + ratio * xDisp;
        this.y = this.y + ratio * yDisp;
      }
    }

    var swTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y + 1);
    if (swTileType != 0) {
      var cornerX = unitCoords.x * map.tileSize;
      var cornerY = (unitCoords.y + 1) * map.tileSize;

      var xDisp = this.x - cornerX;
      var yDisp = this.y - cornerY;

      var dist = Math.sqrt(xDisp * xDisp + yDisp * yDisp);

      var overlap = this.halfWidth - dist;
      if (overlap > 0) {
        var ratio = overlap / dist;

        this.x = this.x + ratio * xDisp;
        this.y = this.y + ratio * yDisp;
      }
    }

    var seTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y + 1);
    if (seTileType != 0) {
      var cornerX = (unitCoords.x + 1) * map.tileSize;
      var cornerY = (unitCoords.y + 1) * map.tileSize;

      var xDisp = this.x - cornerX;
      var yDisp = this.y - cornerY;

      var dist = Math.sqrt(xDisp * xDisp + yDisp * yDisp);

      var overlap = this.halfWidth - dist;
      if (overlap > 0) {
        var ratio = overlap / dist;

        this.x = this.x + ratio * xDisp;
        this.y = this.y + ratio * yDisp;
      }
    }
  }


  setXdir(dir) {
    this.xdir = Math.sign(dir);
  }

  setYdir(dir) {
    this.ydir = Math.sign(dir);
  }
}

module.exports = Unit;
