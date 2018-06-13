const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

var found = false;

var structure = {
  starttime: null,
  map: null,
  team1: {
    name: 'CT',
    score: 0,
  },
  team2: {
    name: 'TERRORIST',
    score: 0,
  },
  players: {},
  rounds: [],
};

//Takes in CT or T and returns team number based on match half
function teamNumber(teamtext) {
  if(teamtext == 'CT') {
    if(structure.rounds.length > 15) {
      return 2;
    } else {
      return 1;
    }
  } else if(teamtext == 'TERRORIST') {
    if(structure.rounds.length > 15) {
      return 1;
    } else {
      return 2;
    }
  }
}

const timestampRgx = /^L\s(\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}:\d{2}:\d{2}):\s?/;
const playerRgx = /"(.+)<\d+><(STEAM.+)>"\s?/;
const playerteamRgx = /"(.+)<\d+><(STEAM.+)><([A-Z]+)>"\s?/;
const coordRgx = /(\[-?\d+\s-?\d+\s-?\d+\])\s?/;
const weapRgx = /with\s"(\w+)"\s?/;
const damageRgx = /\(damage\s"(\d+)"\)\s\(damage_armor\s"(\d+)"\)\s\(health\s"(\d+)"\)\s\(armor\s"(\d+)"\)\s\(hitgroup\s"([a-z]+)"\)$/;
const pistolRgx = /^(glock|usp_silencer|hkp2000|elite|p250|tec9|fiveseven|cz75a|deagle|revolver)$/;

const attackedRgx = new RegExp(timestampRgx.source+playerteamRgx.source+coordRgx.source+'attacked '+playerteamRgx.source+coordRgx.source+weapRgx.source+damageRgx.source);
const killedRgx = new RegExp(timestampRgx.source+playerteamRgx.source+coordRgx.source+'killed '+playerteamRgx.source+coordRgx.source+weapRgx.source+'(?:\\((headshot)\\))?');
const assistRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'assisted killing '+playerteamRgx.source);
const matchstartRgx = new RegExp(timestampRgx.source+'World triggered "Match_Start" on "(\\w+)"');
const roundstartRgx = new RegExp(timestampRgx.source+'World triggered "Round_Start"');
const roundendRgx = new RegExp(timestampRgx.source+'World triggered "Round_End"');
const freezetimeRgx = new RegExp(timestampRgx.source+'Starting Freeze period');
const playertriggeredRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'triggered "(\\w+)"');
const teamtriggeredRgx = new RegExp(timestampRgx.source+'Team "([A-Z]+)" triggered "(\\w+)" \\(CT "(\\d+)"\\) \\(T "(\\d+)"\\)$');
const flashedRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'blinded for (\\d+\\.\\d+) by '+playerteamRgx.source+'from flashbang entindex (\\d+)');
const leftbuyRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'left buyzone with (\\[.*\\])');
const gameoverRgx = new RegExp(timestampRgx.source+'Game Over: ([a-z]+) (\\w+) (\\w+) score (\\d+:\\d+) after (\\d+) min$');
const teamplayingRgx = new RegExp(timestampRgx.source+'Team playing "([A-Z]+)": (.*)');
const rconRgx = new RegExp(timestampRgx.source+'rcon from "\\d+\\.\\d+\\.\\d+\\.\\d+:\\d+": command "(\w+)\\s?(.+)?"');

exports.parseLog = function(logfile, callback) {
  return new Promise((resolve, reject) => {

    const instream = fs.createReadStream(logfile);
    const outstream = new stream;
    const rl = readline.createInterface(instream, outstream);

    rl.on('line', function(line) {

      if(attackedRgx.test(line)) {
        //Player has attacked someone
        var linematch = line.match(attackedRgx);

        //Make sure it was to an opponent
        if(linematch[5] != linematch[9] && linematch[5] != 'Spectator') {

          //If round is active (don't count after round ends)
          if(structure.rounds[structure.rounds.length-1].active) {
            //Add damage to player for this round
            if(parseInt(linematch[14]) == 0) {
              //If victim died, only add their remaining health as damage
              if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4]) && structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) {
                structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].damage += structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].health;
              }
            } else {
              //If it did not kill, add full damage amount
              if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].damage += parseInt(linematch[12]);
            }

            //Set health of victim
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].health = parseInt(linematch[14]);
          }
        }

      } else if(flashedRgx.test(line)) {
        //Player has flashed someone
        var linematch = line.match(flashedRgx);

        //Make sure it was to an opponent
        if(linematch[5] != linematch[9] && linematch[5] != 'Spectator') {
          //If round is active (don't count after round ends)
          if(structure.rounds[structure.rounds.length-1].active) {
            //add flashtime
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].flashenemytime += parseFloat(linematch[6]);
          }
        }

      } else if(killedRgx.test(line)) {
        //Player has killed someone
        var linematch = line.match(killedRgx);

        //Make sure it was to an opponent
        if(linematch[5] != linematch[9] && linematch[5] != 'Spectator') {

          //If round is active (don't count after round ends)
          if(structure.rounds[structure.rounds.length-1].active) {
            //Check if player exists in this round
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) {
              //Add kill to player for this round
              structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].kills ++;
              //Add headshot to player for this round
              if(linematch[12]) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].headshots ++;
              //Add clutchkill if player is last alive
              if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].alive == 1) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].clutchkills ++;
              //Add AWP kill if it was
              if(linematch[11] == 'awp') structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].awpkills ++;
              //Add pistol kill if it was
              if(pistolRgx.test(linematch[11])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].pistolkills ++;
            }
            //Add death to player for this round
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].deaths ++;
            structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].alive --;
          }
        }

      } else if(assistRgx.test(line)) {
        //Player has assisted in killing someone
        var linematch = line.match(assistRgx);

        //Make sure it was to an opponent
        if(linematch[5] != linematch[9] && linematch[5] != 'Spectator') {

          //If round is active (don't count after round ends)
          if(structure.rounds[structure.rounds.length-1].active) {
            //Add assist to player for this round
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].assists ++;
          }
        }

      } else if(leftbuyRgx.test(line)) {
        //Player has left the buyzone
        var linematch = line.match(leftbuyRgx);

        //Main Players Table
        if(!structure.players.hasOwnProperty(linematch[4])) {
          //If player doesn't exist, make one
          var newplayer = {
            name: linematch[3],
            steamid: linematch[4],
            team: teamNumber(linematch[5]),
            kills: 0,
            assists: 0,
            deaths: 0,
            damage: 0,
            headshots: 0,
            awpkills: 0,
            pistolkills: 0,
            clutchkills: 0,
            flashenemytime: 0,
            bombsplanted: 0,
            bombsdefused: 0,
            rounds3k: 0,
            rounds4k: 0,
            rounds5k: 0,
            roundsplayed: 0,
            adr: 0
          };
          structure.players[linematch[4]] = newplayer;
        }

        //Round specific player table
        if(structure.rounds.length > 0 && !structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) {
          var newplayer = {
            kills: 0,
            assists: 0,
            deaths: 0,
            damage: 0,
            headshots: 0,
            awpkills: 0,
            pistolkills: 0,
            clutchkills: 0,
            flashenemytime: 0,
            bombsplanted: 0,
            bombsdefused: 0,
            health: 100
          };

          //Set new player in this round for their team
          structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]] = newplayer;
          structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].alive ++;
        }

      } else if(playertriggeredRgx.test(line)) {
        //Player has triggered an event
        var linematch = line.match(playertriggeredRgx);

        switch(linematch[6]) {
          case 'Planted_The_Bomb':
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) {
              structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].bombsplanted ++;
            }
          break;
          case 'Defused_The_Bomb':
          if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) {
            structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].bombsdefused ++;
          }
          break;
        }

      } else if(teamtriggeredRgx.test(line)) {
        //Team has triggered an event
        var linematch = line.match(teamtriggeredRgx);

        if(structure.rounds.length > 0) {

          structure.rounds[structure.rounds.length-1].teamwon = teamNumber(linematch[3]);

          if(structure.rounds.length > 15) {
            //Past round 15, teams have swapped, 1=T 2=CT
            structure.team1.score = linematch[6];
            structure.team2.score = linematch[5];
            structure.rounds[structure.rounds.length-1].team1.score = linematch[6];
            structure.rounds[structure.rounds.length-1].team2.score = linematch[5];
          } else {
            //Teams have not swapped, 1=CT 2=T
            structure.team1.score = linematch[5];
            structure.team2.score = linematch[6];
            structure.rounds[structure.rounds.length-1].team1.score = linematch[5];
            structure.rounds[structure.rounds.length-1].team2.score = linematch[6];
          }

        }

      } else if(roundstartRgx.test(line)) {
        //Round has started (after freezetime)
        var linematch = line.match(roundstartRgx);

        //Create unix timestamp from datetime of line
        var date = linematch[1].split('/');
        var timestamp = new Date(date[2]+'-'+date[0]+'-'+date[1]+'T'+linematch[2]+'Z').getTime();

        var oldt1score = 0;
        var oldt2score = 0;
        if(structure.rounds.length > 0) {
          oldt1score = structure.rounds[structure.rounds.length-1].team1.score;
          oldt2score = structure.rounds[structure.rounds.length-1].team2.score;
        }
        var newround = {
          active: true,
          timestamp: timestamp,
          teamwon: -1,
          team1: {
            score: oldt1score,
            alive: 0,
            players: {}
          },
          team2: {
            score: oldt2score,
            alive: 0,
            players: {}
          }
        };
        structure.rounds.push(newround);

      } else if(freezetimeRgx.test(line)) {
        //Freezetime has started
        //var linematch = line.match(freezetimeRgx);

      } else if(roundendRgx.test(line)) {
        //Round has ended
        //var linematch = line.match(roundendRgx);

      } else if(matchstartRgx.test(line)) {
        //Match has started
        var linematch = line.match(matchstartRgx);

        //Create unix timestamp from datetime of line
        var date = linematch[1].split('/');
        var timestamp = new Date(date[2]+'-'+date[0]+'-'+date[1]+'T'+linematch[2]+'Z').getTime();

        //Set starttime and map of match
        structure.starttime = timestamp;
        structure.map = linematch[3];

        structure.team1.score = 0;
        structure.team2.score = 0;
        structure.players = {};
        structure.rounds.length = 0;
        myvar = 0;

      } else if(rconRgx.test(line)) {
        //rcon command has been issued
        var linematch = line.match(rconRgx);

        var mpteamnameRgx = /^mp_teamname_([1-2])\s(.*)/;
        if(mpteamnameRgx.test(linematch[3])) {
          structure[team+linematch[3].match(mpteamnameRgx)[1]].name = linematch[3].match(mpteamnameRgx)[2];
        }

      } else if(teamplayingRgx.test(line)) {
        //Teamname has been set
        var linematch = line.match(teamplayingRgx);

        if(linematch[3] == 'CT') {
          structure.team1.name = linematch[4];
        } else if(linematch[3] == 'TERRORIST') {
          structure.team2.name = linematch[4];
        }

      } else if(gameoverRgx.test(line)) {
        //Game is over
        //Loop through each round to total up player scores
        structure.rounds.forEach(function(round) {
            //Loop through team 1
            Object.keys(round.team1.players).map(function(playerKey, index) {
              if(structure.players.hasOwnProperty(playerKey)) {
                var fullplayer = structure.players[playerKey];
                var roundplayer = round.team1.players[playerKey];
                fullplayer.kills += roundplayer.kills;
                fullplayer.assists += roundplayer.assists;
                fullplayer.deaths += roundplayer.deaths;
                fullplayer.damage += roundplayer.damage;
                fullplayer.headshots += roundplayer.headshots;
                fullplayer.awpkills += roundplayer.awpkills;
                fullplayer.pistolkills += roundplayer.pistolkills;
                fullplayer.flashenemytime += roundplayer.flashenemytime;
                fullplayer.bombsplanted += roundplayer.bombsplanted;
                fullplayer.bombsdefused += roundplayer.bombsdefused;
                fullplayer.roundsplayed ++;
                if(roundplayer.kills == 3) fullplayer.rounds3k ++;
                if(roundplayer.kills == 4) fullplayer.rounds4k ++;
                if(roundplayer.kills == 5) fullplayer.rounds5k ++;
                if(round.teamwon == 1) fullplayer.clutchkills += roundplayer.clutchkills;
                fullplayer.adr = fullplayer.damage/fullplayer.roundsplayed;
              }
            });
            //Loop through team 2
            Object.keys(round.team2.players).map(function(playerKey, index) {
              if(structure.players.hasOwnProperty(playerKey)) {
                var fullplayer = structure.players[playerKey];
                var roundplayer = round.team2.players[playerKey];
                fullplayer.kills += roundplayer.kills;
                fullplayer.assists += roundplayer.assists;
                fullplayer.deaths += roundplayer.deaths;
                fullplayer.damage += roundplayer.damage;
                fullplayer.headshots += roundplayer.headshots;
                fullplayer.awpkills += roundplayer.awpkills;
                fullplayer.pistolkills += roundplayer.pistolkills;
                fullplayer.flashenemytime += roundplayer.flashenemytime;
                fullplayer.bombsplanted += roundplayer.bombsplanted;
                fullplayer.bombsdefused += roundplayer.bombsdefused;
                fullplayer.roundsplayed ++;
                if(roundplayer.kills == 3) fullplayer.rounds3k ++;
                if(roundplayer.kills == 4) fullplayer.rounds4k ++;
                if(roundplayer.kills == 5) fullplayer.rounds5k ++;
                if(round.teamwon == 2) fullplayer.clutchkills += roundplayer.clutchkills;
                fullplayer.adr = fullplayer.damage/fullplayer.roundsplayed;
              }
            });
        });

        //console.log(line);
        //var linematch = line.match(gameoverRgx);
        found = true;
        //structure.active = false;
        rl.close();
      }

    })

    rl.on('close', function() {
      //finished file
      //console.log(util.inspect(structure, false, null));
      //console.log(structure);
      if(found) {
        //console.log('Game Found!');
        callback(structure);
        found = false;
      } else {
        //console.log('Game did not end :(');
        callback('Game not found');
      }
    });

  });
}
