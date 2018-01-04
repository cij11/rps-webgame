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
    var topLeft = {
      x: this.x - this.halfWidth,
      y: this.y - this.halfWidth
    },
    topRight = {
      x: this.x + this.halfWidth,
      y: this.y - this.halfWidth
    },
    botLeft = {
      x: this.x - this.halfWidth,
      y: this.y + this.halfWidth
    },
    botRight = {
      x: this.x + this.halfWidth,
      y: this.y + this.halfWidth
    };


    var corners = [];
    corners.push(topLeft);
    corners.push(topRight);
    corners.push(botLeft);
    corners.push(botRight);

    this._resolveCornerOverlap(corners, map);
  }

  _resolveCornerOverlap(corners, map) {
    _.forEach(corners, corner => {
      var destinationTileType = map.getTileAtPixelCoords(corner.x, corner.y);
      if (destinationTileType != 0) {
        console.log('Corner colliding');
        //Extrude the unit by the smallest possible distance
        var xPercent = corner.x - Math.floor(corner.x/map.tileSize) * map.tileSize;
        var yPercent = corner.y - Math.floor(corner.y/map.tileSize) * map.tileSize;

        var xOverlap = xPercent < map.tileSize/2 ? -xPercent : map.tileSize - xPercent;
        var yOverlap = yPercent < map.tileSize/2 ? -yPercent : map.tileSize - yPercent;

        if (Math.abs(xOverlap) < Math.abs(yOverlap)) {
          this.x = this.x + xOverlap;
        } else {
          this.y = this.y + yOverlap;
        }
      } else {
        console.log('no corner collision');
      }
    })
  }

  setXdir(dir) {
    this.xdir = Math.sign(dir);
  }

  setYdir(dir) {
    this.ydir = Math.sign(dir);
  }
}

module.exports = Unit;
