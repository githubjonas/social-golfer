
class Tee {
  constructor(no, size) {
    this.no = no;
    this.size = size;
    this.players = [];
  }

  addPlayer(player) {
    if (this.players.length < this.size) {
      this.players.push(player);
      return true;
    } else {
      return false;
    }
  }

  isFilled() {
    return !(this.players.length < this.size);
  }
}

module.exports = class StartListGenerator {
  constructor(players, rounds) {
    this.players = players;
    this.rounds = rounds;
  }

  generate(tries = 500) {

    let penalty = 1000000000;
    let bestResult = [];

    for (let i = 0; i < tries; i++) {
      let result = [];

      this.rounds.forEach((round, roundNo) => {
        let tees = this.getTees();
        let players = this.players.slice();
        tees.forEach((tee) => {
          while (!tee.isFilled()) {
            let player = null;
            if (tee.players.length == 0) {
              let i = Math.floor(Math.random() * players.length);
              player = players[i];
              players.splice(i, 1);
            } else {
              let candidates = this.findCandidates(player, players, result);
              if (candidates.length > 0) {
                let i = Math.floor(Math.random() * candidates.length);
                player = players[i];
                players.splice(i, 1);
              } else {
                let i = Math.floor(Math.random() * players.length);
                player = players[i];
                players.splice(i, 1);
              }
            }
            tee.addPlayer(player);
          }
        });

        result.push({
          round,
          tees
        });
      });
      let thisPenalty = this.getPenalty(result);
      if (thisPenalty < penalty) {
        penalty = thisPenalty;
        bestResult = result;
      }
    }

    const generated = { penalty, result: bestResult };

    return generated;
  }

  getPenalty(result) {
    let penalty = 0.0;
    const penalties = this.getPenaltyList(result);
    penalties.forEach((p) => {

      penalty += p.penalty;
    });

    return penalty;
  }

  getPenaltyList(result) {
    let penalties = [];
    let matrix = this.getPlayerMatrix(result);

    Object.keys(matrix).forEach((player) => {
      let missing = this.players.slice();
      matrix[player].forEach((p1) => {
        missing.splice(missing.indexOf(p1), 1);
      });
      if (missing.indexOf(player) !== -1) {
        missing.splice(missing.indexOf(player), 1);
      }
      if (missing.length > 0) {
        penalties.push({
          player,
          missing,
          penalty: 0.3 * missing.length
        });
      }
    });

    let pc = {};
    Object.keys(matrix).forEach((player) => {
      matrix[player].forEach((p2) => {
        let key = player < p2 ? `${player},${p2}` : `${p2},${player}`;
        if (pc[key]) {
          pc[key]++;
        } else {
          pc[key] = 1;
        }
      });
    });

    Object.keys(pc).forEach((key) => {
      if (pc[key] > 2) {
        penalties.push({
          multiplay: key,
          count: pc[key] / 2,
          penalty: 0.2 * (pc[key] * pc[key] - 1)
        });
      }
    });

    return penalties;
  }

  getPlayerMatrix(result) {
    let matrix = {};
    this.players.forEach((player) => {
      matrix[player] = [];
    });
    result.forEach((r) => {
      r.tees.forEach((tee) => {
        tee.players.forEach((p1) => {
          tee.players.forEach((p2) => {
            if (p1 != p2) {
              matrix[p1].push(p2);
            }
          });
        });
      });
    });

    return matrix;
  }


  findCandidates(player, players, result) {
    let candidates = [];
    players.forEach((otherPlayer) => {
      if (!this.hasPlayedWith(player, otherPlayer, result)) {
        candidates.push(otherPlayer);
      }
    });

    return candidates;
  }

  hasPlayedWith(player1, player2, result) {
    result.forEach((r) => {
      let p1 = false;
      let p2 = false;
      r.tees.forEach((tee) => {
        tee.players.forEach((player) => {
          if (player == player1) p1 = true;
          if (player == player2) p2 = true;
        });
      });
      if (p1 && p2) return true;
    });
    return false;
  }

  getTees() {
    let cp = this.players.length;
    let rest = cp % 4;

    let teeTimes = [];
    let nxtTee = 1;
    if (rest === 1 && cp > 8) {
      teeTimes = [
        new Tee(1, 3),
        new Tee(2, 3)
      ];
      nxtTee = 3;
      cp -= 6;
    } else if (rest < 3 && rest > 0) {
      teeTimes = [
        new Tee(1, 3)
      ];
      rest = 3;
      nxtTee = 2;
      cp -= rest;
    }

    let sanity = 10000;

    while  (cp > 0 && sanity-- > 0) {
      let size = (cp % 4 !== 0) ? cp % 4 : 4;
      teeTimes.push(new Tee(nxtTee, size));
      nxtTee++;
      cp -= size;
    }

    return teeTimes;
  }
}

