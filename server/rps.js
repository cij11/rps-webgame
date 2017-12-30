/* Class declaration syntax sugar from ECMAScript 2015
   Syntactically similar to:

   function RpsGame(p1, p2) {
   this._p1 = p1;
   this._p2 = p2;
 }

 Although note that class declarations are not hoisted.
 */

const _ = require('lodash');

class RpsGame {

  constructor(p1, p2) {
    this._players = [p1, p2];
    this._moves = [null, null];

    this._sendToPlayers('Rock Paper Scissors Starts.');

    this._players.forEach((player, index) => {
      player.on('move', (move) => {
        this._onMove(index, move);
      });
    });
  }

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    _.forEach(this._players, player => {
      player.emit('message', msg);
    })
  }

  _onMove(playerIndex, move) {
    this._moves[playerIndex] = move;
    this._sendToPlayer(playerIndex, `You selected ${move}`);
  }
}


module.exports = RpsGame;
