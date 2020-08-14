const SocialGolfer = require('../SocialGolfer.js');

const players = ["Joe", "Ben", "Shelly", "Mark", "Justin", "Michael", "Tony"];
const rounds = ["Thursday", "Friday", "Saturday"];

slg = new SocialGolfer(players, rounds);

const result = slg.generate();

result.result.forEach((round) => {
  console.log(`** ${round.round} **`);
  console.log(round.tees);
});
