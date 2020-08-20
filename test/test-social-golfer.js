let expect = require("chai").expect;
let SocialGolfer = require("../SocialGolfer");

const players = ["Joe", "Ben", "Shelly", "Mark", "Justin", "Michael", "Tony"];
const rounds = ["Thursday", "Friday", "Saturday"];
const slg = new SocialGolfer(players, rounds);

describe('social-golfer', () => {

  it('should be possible to generate a solution', () => {
    const solution = slg.generate();
    expect(solution.result.length).to.equal(3);
    expect(solution.penalty).to.equal(21);
  });

  it('should contain all players all rounds', () => {
    const solution = slg.generate();
    solution.result.forEach((r) => {
      let teeNo = 1;
      r.tees.forEach((tee) => {
        expect(tee.no).to.equal(teeNo++);
        expect(tee.players.length).to.equal(tee.size);
      });
    });
  });

  it('should be possible to analyze a solution', () => {
    const solution = slg.generate();
    const penaltyList = slg.getPenaltyList(solution.result);
    expect(penaltyList.length).to.equal(3);
    penaltyList.forEach((penalty) => {
      expect(penalty.count).to.equal(3);
      expect(penalty.penalty).to.equal(7);
    });
  });

});
