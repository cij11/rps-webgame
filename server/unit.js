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
    var proposedX = this.x + this.xdir * this.speed,
    proposedY = this.y + this.ydir * this.speed,
    xEdge = proposedX + this.xdir * this.halfWidth,
    yEdge = proposedY + this.ydir * this.halfWidth,
    destinationTileType = map.getTileAtPixelCoords(xEdge, yEdge);

    if (destinationTileType === 0) {
      this.x = proposedX;
      this.y = proposedY;
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
