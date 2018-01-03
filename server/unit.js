const _ = require('lodash');
const Player = require('./player.js');

class Unit {
  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;

    this.xdir = 1;
    this.ydir = 0;
    this.speed = 5;
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }

  getRenderingData() {
    return this.getPosition();
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

  update() {
    this._updatePosition();
  }

  _updatePosition() {
    this.x = this.x + this.xdir * this.speed;
    this.y = this.y + this.ydir * this.speed;
  }

  setXdir(dir) {
    this.xdir = Math.sign(dir);
  }

  setYdir(dir) {
    this.ydir = Math.sign(dir);
  }
}

module.exports = Unit;
