(function () {
  "use strict";

  var walk = require('walk');
  var fs = require('fs');
  var options;
  var walker;
  var pl = require('./parser');

  var totalplayer = {
    kills: 0,
    assists: 0,
    deaths: 0,
    kdratio: 0,
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
    adr: 0,
    games: 0
  };

  var logger = fs.createWriteStream('output.txt', {
    flags: 'a'
  });

  options = {
    followLinks: false
    // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
  };

  walker = walk.walk("./logs/", options);

  walker.on("names", function (root, nodeNamesArray) {
    nodeNamesArray.sort(function (a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  });

  walker.on("directories", function (root, dirStatsArray, next) {
    // dirStatsArray is an array of `stat` objects with the additional attributes
    // * type
    // * error
    // * name

    next();
  });

  walker.on("file", function (root, fileStats, next) {
    pl.parseLog(root+'\\'+fileStats.name, (log) => {
      if(log != "Game not found") {
        //console.log(log.team1.name+" vs "+log.team2.name+" on "+log.map+" - "+log.team1.score+":"+log.team2.score);
        //logger.write(log.team1.name+" vs "+log.team2.name+" on "+log.map+" - "+log.team1.score+":"+log.team2.score+"\r\n");
        var selectedplayer = 'STEAM_1:0:60629419';
        if(log.players.hasOwnProperty(selectedplayer) && log.map != "de_dust2") {
          totalplayer.kills += log.players[selectedplayer].kills;
          totalplayer.assists += log.players[selectedplayer].assists;
          totalplayer.deaths += log.players[selectedplayer].deaths;
          totalplayer.damage += log.players[selectedplayer].damage;
          totalplayer.headshots += log.players[selectedplayer].headshots;
          totalplayer.awpkills += log.players[selectedplayer].awpkills;
          totalplayer.pistolkills += log.players[selectedplayer].pistolkills;
          totalplayer.flashenemytime += log.players[selectedplayer].flashenemytime;
          totalplayer.bombsplanted += log.players[selectedplayer].bombsplanted;
          totalplayer.bombsdefused += log.players[selectedplayer].bombsdefused;
          totalplayer.roundsplayed += log.players[selectedplayer].roundsplayed;
          totalplayer.rounds3k += log.players[selectedplayer].rounds3k;
          totalplayer.rounds4k += log.players[selectedplayer].rounds4k;
          totalplayer.rounds5k += log.players[selectedplayer].rounds5k;
          totalplayer.clutchkills += log.players[selectedplayer].clutchkills;
          totalplayer.adr += log.players[selectedplayer].adr;
          totalplayer.games ++;
        }

      }
      next();
    })
    .catch(function(error) {
      console.log(error);
    });
  });

  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });

  walker.on("end", function () {
    logger.end();
    console.log("all done");
    var avgplayer = {};
    avgplayer.kills = totalplayer.kills/totalplayer.games;
    avgplayer.assists = totalplayer.assists/totalplayer.games;
    avgplayer.deaths = totalplayer.deaths/totalplayer.games;
    avgplayer.damage = totalplayer.damage/totalplayer.games;
    avgplayer.headshots = totalplayer.headshots/totalplayer.games;
    avgplayer.awpkills = totalplayer.awpkills/totalplayer.games;
    avgplayer.pistolkills = totalplayer.pistolkills/totalplayer.games;
    avgplayer.flashenemytime = totalplayer.flashenemytime/totalplayer.games;
    avgplayer.bombsplanted = totalplayer.bombsplanted/totalplayer.games;
    avgplayer.bombsdefused = totalplayer.bombsdefused/totalplayer.games;
    avgplayer.roundsplayed = totalplayer.roundsplayed/totalplayer.games;
    avgplayer.rounds3k = totalplayer.rounds3k/totalplayer.games;
    avgplayer.rounds4k = totalplayer.rounds4k/totalplayer.games;
    avgplayer.rounds5k = totalplayer.rounds5k/totalplayer.games;
    avgplayer.clutchkills = totalplayer.clutchkills/totalplayer.games;
    avgplayer.adr = totalplayer.adr/totalplayer.games;
    avgplayer.games = totalplayer.games;
    fs.writeFile('./results/maison.json', JSON.stringify(avgplayer, null, 2) , 'utf-8');
  });
}());
