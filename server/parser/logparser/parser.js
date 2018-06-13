const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

var gamelist = [];

var structure = {
  organiser: 'NUEL',
  tournament: 'Spring 2018',
  path: null,
  demo: null,
  starttime: null,
  map: null,
  duration: null,
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

var firstkillflag = false;

//Takes in CT or T and returns team number based on match half
function teamNumber(teamtext) {
  if(teamtext === 'CT') {
    if(
      (structure.rounds.length > 15 && structure.rounds.length < 34)
      ||
      (structure.rounds.length > 39 && structure.rounds.length < 46)
      ||
      (structure.rounds.length > 51 && structure.rounds.length < 58)
    ) {
      return 2;
    } else {
      return 1;
    }
  } else if(teamtext === 'TERRORIST') {
    if(
      (structure.rounds.length > 15 && structure.rounds.length < 34)
      ||
      (structure.rounds.length > 39 && structure.rounds.length < 46)
      ||
      (structure.rounds.length > 51 && structure.rounds.length < 58)
    ) {
      return 1;
    } else {
      return 2;
    }
  }
}

function reasonSimplifier(reason) {
  switch(reason) {
    case 'SFUI_Notice_CTs_Win':
      return 'elim';
    case 'SFUI_Notice_Terrorists_Win':
      return 'elim';
    case 'SFUI_Notice_Bomb_Defused':
      return 'defuse';
    case 'SFUI_Notice_Target_Bombed':
      return 'bomb';
    case 'SFUI_Notice_Target_Saved':
      return 'time';
    default:
      return 'hostage';
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
const killedRgx = new RegExp(timestampRgx.source+playerteamRgx.source+coordRgx.source+'killed '+playerteamRgx.source+coordRgx.source+weapRgx.source+'\\(?(\\w*)\\s?(\\w*)\\)?');
const assistRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'assisted killing '+playerteamRgx.source);
const matchstartRgx = new RegExp(timestampRgx.source+'World triggered "Match_Start" on "(\\w+)"');
const roundstartRgx = new RegExp(timestampRgx.source+'World triggered "Round_Start"');
const roundendRgx = new RegExp(timestampRgx.source+'World triggered "Round_End"');
const freezetimeRgx = new RegExp(timestampRgx.source+'Starting Freeze period');
const playertriggeredRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'triggered "(\\w+)"');
const teamtriggeredRgx = new RegExp(timestampRgx.source+'Team "([A-Z]+)" triggered "(\\w+)" \\(CT "(\\d+)"\\) \\(T "(\\d+)"\\)$');
const flashedRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'blinded for (\\d+\\.\\d+) by '+playerteamRgx.source+'from flashbang entindex (\\d+)');
const leftbuyRgx = new RegExp(timestampRgx.source+playerteamRgx.source+'left buyzone with (\\[.*\\])');
const gameoverRgx = new RegExp(timestampRgx.source+'Game Over: [a-z]+ \\w+ (\\w+) score (\\d+):(\\d+) after (\\d+) min$');
const teamplayingRgx = new RegExp(timestampRgx.source+'Team playing "([A-Z]+)": (.*)');
const rconRgx = new RegExp(timestampRgx.source+'rcon from "\\d+\\.\\d+\\.\\d+\\.\\d+:\\d+": command "(\w+)\\s?(.+)?"');

exports.parseLog = function(logfile, callback) {

  /*fs.readFile('demofiles.json', (err, data) => {
    if(err) throw err
    var demos = JSON.parse(data);
    var demoNameRgx = /^auto0-(\d{8})-(\d{4})\d{2}-\d+-(de_cache|de_cbble|de_inferno|de_mirage|de_nuke|de_overpass|de_train)-\w*\.dem$/;
    var pathRgx = /^\.\/logs\/\\w(\d)\\(\d+)\\logfiles\\L010_000_000_004_27015_(\d{4}\d{2}\d{2})(\d{4})_\d\d\d\.log$/;
    var pathbits = logfile.match(pathRgx);
    var baseURL = 'https://nuelgameserversnew.blob.core.windows.net/replays/2018%20Spring%20Week%20'+pathbits[1]+'/csgo-server-';
    var found = false;
    //Check if week exists
    if(demos.hasOwnProperty(pathbits[1])) {
      //Apply fixes for week 2 lol
      if(parseInt(pathbits[1], 10) === 2) {
        if(parseInt(pathbits[2], 10) === 55) {
          pathbits[2] = String(parseInt(pathbits[2], 10) + 6);
        } else if(parseInt(pathbits[2], 10) < 55) {
          pathbits[2] = String(parseInt(pathbits[2], 10) + 5);
        } else if(parseInt(pathbits[2], 10) < 60) {
          pathbits[2] = 'backup-'+(parseInt(pathbits[2], 10)-54);
        } else {
          pathbits[2] = String(parseInt(pathbits[2], 10) + 1);
        }
      }
      //Check if server number exists
      if(demos[pathbits[1]].hasOwnProperty(pathbits[2])) {
        //Loop through each demo name from server
        for(var demo in demos[pathbits[1]][pathbits[2]]) {
          var demoParts = demos[pathbits[1]][pathbits[2]][demo].match(demoNameRgx);
          if(demoParts[1] === pathbits[3]) {
            if(demoParts[2] === pathbits[4]) {
              structure.demo = baseURL +pathbits[2]+'/' + demos[pathbits[1]][pathbits[2]][demo];
              found = true;
              break;
            } else if(Math.abs(parseInt(demoParts[2], 10) - parseInt(pathbits[4], 10)) < 2) {
              structure.demo = baseURL +pathbits[2]+'/' + demos[pathbits[1]][pathbits[2]][demo];
              found = true;
              break;
            }
          }
        }
      }
    }
    if(!found) {
      structure.demo = 'No demo found';
    }
    demos = {};
  });*/

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
          if(parseInt(linematch[14], 10) === 0) {
            //If victim died, only add their remaining health as damage
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4]) && structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) {
              structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].damage += structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].health;
            }
          } else {
            //If it did not kill, add full damage amount
            if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].damage += parseInt(linematch[12], 10);
          }

          //Set health of victim
          if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players.hasOwnProperty(linematch[8])) structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[9])].players[linematch[8]].health = parseInt(linematch[14], 10);
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
            var newkill = {
              victim: linematch[8],
              weapon: linematch[11],
              headshot: linematch[12] === 'headshot' ? true : false,
              penetrated: linematch[13] === 'penetrated' ? true : false,
              clutch: structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].alive === 1 ? true : false,
              firstkill: firstkillflag
            };
            firstkillflag = false;
            structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players[linematch[4]].kills.push(newkill);
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
        structure.players[linematch[4]] = linematch[3];
      }

      //Round specific player table
      if(structure.rounds.length > 0 && !structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].players.hasOwnProperty(linematch[4])) {
        var newplayer = {
          kills: [],
          assists: 0,
          deaths: 0,
          damage: 0,
          flashenemytime: 0,
          bombsplanted: 0,
          bombsdefused: 0,
          health: 100
        };

        //If the side is not up to date, update it
        if(structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].side !== linematch[5]) {
          structure.rounds[structure.rounds.length-1]['team'+teamNumber(linematch[5])].side = linematch[5];
        }

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
        structure.rounds[structure.rounds.length-1].reason = reasonSimplifier(linematch[4]);
        structure['team'+teamNumber('TERRORIST')].score = parseInt(linematch[6], 10);
        structure['team'+teamNumber('CT')].score = parseInt(linematch[5], 10);
        structure.rounds[structure.rounds.length-1]['team'+teamNumber('TERRORIST')].score = parseInt(linematch[6], 10);
        structure.rounds[structure.rounds.length-1]['team'+teamNumber('CT')].score = parseInt(linematch[5], 10);
        /*if(teamNumber(linematch[3]) === 2) {
          //Past round 15, teams have swapped, 1=T 2=CT
          structure.team1.score = parseInt(linematch[6], 10);
          structure.team2.score = parseInt(linematch[5], 10);
          structure.rounds[structure.rounds.length-1].team1.score = parseInt(linematch[6], 10);
          structure.rounds[structure.rounds.length-1].team2.score = parseInt(linematch[5], 10);
        } else {
          //Teams have not swapped, 1=CT 2=T
          structure.team1.score = parseInt(linematch[5], 10);
          structure.team2.score = parseInt(linematch[6], 10);
          structure.rounds[structure.rounds.length-1].team1.score = parseInt(linematch[5], 10);
          structure.rounds[structure.rounds.length-1].team2.score = parseInt(linematch[6], 10);
        }*/

      }

    } else if(roundstartRgx.test(line)) {
      //Round has started (after freezetime)
      var linematch = line.match(roundstartRgx);

      //Create unix timestamp from datetime of line
      var date = linematch[1].split('/');
      var timestamp = new Date(date[2]+'-'+date[0]+'-'+date[1]+'T'+linematch[2]+'Z').getTime() / 1000;

      oldround = {
        team1: {
          score: 0
        },
        team2: {
          score: 0
        }
      };
      if(structure.rounds.length > 0) {
        oldround = structure.rounds[structure.rounds.length-1];
      }
      var newround = {
        active: true,
        timestamp: timestamp,
        teamwon: -1,
        reason: null,
        team1: {
          score: oldround.team1.score,
          alive: 0,
          players: {}
        },
        team2: {
          score: oldround.team2.score,
          alive: 0,
          players: {}
        }
      };
      structure.rounds.push(newround);

      firstkillflag = true;

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
      var timestamp = new Date(date[2]+'-'+date[0]+'-'+date[1]+'T'+linematch[2]+'Z').getTime() / 1000;

      //Set starttime and map of match
      structure.starttime = timestamp;
      structure.map = linematch[3];

      structure.team1.score = 0;
      structure.team2.score = 0;
      structure.players = {};
      structure.rounds.length = 0;

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

      if(linematch[3] === 'CT') {
        structure.team1.name = linematch[4];
      } else if(linematch[3] === 'TERRORIST') {
        structure.team2.name = linematch[4];
      }

    } else if(gameoverRgx.test(line)) {
      //Game is over

      //console.log(line);
      var linematch = line.match(gameoverRgx);
      structure.duration = parseInt(linematch[6], 10);
      structure.path = logfile;
      var mapRgx = /^(de_cache|de_cbble|de_inferno|de_mirage|de_nuke|de_overpass|de_train)$/;
      if(mapRgx.test(structure.map)) {
        gamelist.push(JSON.parse(JSON.stringify(structure)));
      }
    }

  })

  rl.on('close', function() {
    //finished file
    //console.log(structure);
    if(gamelist.length > 0) {
      callback(gamelist);
      gamelist = [];
    } else {
      callback('Game not found');
      gamelist = [];
    }

  });
}
