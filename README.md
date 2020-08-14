# social-golfer

## Abstract
### The Problem
In a golf club, there are x social golfers, each of whom plays golf for a number of rounds, in groups (tees) of maximum 4. The problem is to build a schedule of play for n rounds with maximum socialisation and with as few repeated meetings as possible. More generally the problem is to schedule m groups of n golfers over p rounds, with maximum socialisation. The complexity of the problem is unknown. The instance mentioned has a known solution with no repeated meeting. 

## Installation
    npm install social-golfer
    
## Usage
    const SocialGolfer = require('social-golfer');
    
    const players = ["Joe", "Ben", "Shelly", "Mark", "Justin", "Michael", "Tony"];
    const rounds = ["Thursday", "Friday", "Saturday"];
    
    const slg = new SocialGolfer(players, rounds);
    const solution = slg.generate();
