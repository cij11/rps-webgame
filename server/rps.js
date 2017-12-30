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

    this._checkGameOver();
  }

  _checkGameOver() {
    const moves = this._moves;

    if(moves[0] && moves[1]){
      this._sendToPlayers('Game over: ' + moves.join(' : '));
      this._getGameResult();
      this._moves = [null, null];
      this._sendToPlayers('Next round!');
    }
  }

  _getGameResult() {

    const p0 = this._decodeMove(this._moves[0]);
    const p1 = this._decodeMove(this._moves[1]);

    const distance = (p1 - p0 + 3) % 3;

    switch (distance) {
        case 0:
          this._sendToPlayers('Draw');
          //draw
          break;
        case 1:
          //P0 wins
          this._sendWinMessage(this._players[0], this._players[1]);
          break;
        case 2:
          //p1 wins
          this._sendWinMessage(this._players[1], this._players[0]);
          break;
      default:
    }
  }

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You Won!');
    loser.emit('message', 'You Lost.');
  }

  _decodeMove(move) {
    switch (move) {
      case 'rock':
        return 0;
        break;
      case 'scissors':
        return 1;
        break;
      case 'paper':
        return 2;
        break;
      default:
      throw new Error(`could not decode move ${move}`);

    }
  }
}


module.exports = RpsGame;
