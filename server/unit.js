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
    var wTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y);
    var wPoint = {x: unitCoords.x * map.tileSize, y: this.y };

    var eTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y);
    var ePoint = {x: (unitCoords.x + 1) * map.tileSize, y: this.y };

    var nTileType = map.getTileTypeByTileCoords(unitCoords.x, unitCoords.y - 1);
    var nPoint = {x: this.x, y: unitCoords.y * map.tileSize};

    var sTileType = map.getTileTypeByTileCoords(unitCoords.x, unitCoords.y + 1);
    var sPoint = {x: this.x, y: (unitCoords.y + 1)* map.tileSize};

    //Corner collisions
    var nwTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y - 1);
    var nwPoint = {x: unitCoords.x * map.tileSize, y: unitCoords.y * map.tileSize};

    var neTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y - 1);
    var nePoint = {x: (unitCoords.x + 1) * map.tileSize, y: unitCoords.y * map.tileSize};

    var swTileType = map.getTileTypeByTileCoords(unitCoords.x - 1, unitCoords.y + 1);
    var swPoint = {x: unitCoords.x * map.tileSize, y:  (unitCoords.y + 1) * map.tileSize};

    var seTileType = map.getTileTypeByTileCoords(unitCoords.x + 1, unitCoords.y + 1);
    var sePoint = {x: (unitCoords.x + 1) * map.tileSize, y: (unitCoords.y + 1) * map.tileSize};

    var pointsToCheck = [];
    pointsToCheck.push({point: wPoint, tile: wTileType});
    pointsToCheck.push({point: ePoint, tile: eTileType});
    pointsToCheck.push({point: nPoint, tile: nTileType});
    pointsToCheck.push({point: sPoint, tile: sTileType});

    pointsToCheck.push({point: nwPoint, tile: nwTileType});
    pointsToCheck.push({point: nePoint, tile: neTileType});
    pointsToCheck.push({point: swPoint, tile: swTileType});
    pointsToCheck.push({point: sePoint, tile: seTileType});

    _.forEach(pointsToCheck, check => {
      if (check.tile != 0) {
        console.log('collision' + new Date());
        this.extrudeCirclePointOverlap(check.point.x, check.point.y);
      }
    });
  }

  extrudeCirclePointOverlap(pointX, pointY) {
    var xDisp = this.x - pointX;
    var yDisp = this.y - pointY;

    var dist = Math.sqrt(xDisp * xDisp + yDisp * yDisp);

    var overlap = this.halfWidth - dist;
    if (overlap > 0) {
      var ratio = overlap / dist;

      this.x = this.x + ratio * xDisp;
      this.y = this.y + ratio * yDisp;
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
