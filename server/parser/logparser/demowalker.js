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

  var demos = {};

  var logger = fs.createWriteStream('output.txt', {
    flags: 'a'
  });

  options = {
    followLinks: false
    // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
  };

  walker = walk.walk("A:/NUELdemos/2018 Spring Championship/", options);

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
    var baseURL = 'https://nuelgameserversnew.blob.core.windows.net/replays/';
    var pathRgx = /^A:\/NUELdemos\/2018 Spring Championship\/\\2018 Spring Week (\d)\\csgo-server-(\d+)$/;
    var nameRgx = /^auto0-\d+-\d+-\d+-(de_cache|de_cbble|de_inferno|de_mirage|de_nuke|de_overpass|de_train)-\w*\.dem$/;
    var parts = root.match(pathRgx);
    if(pathRgx.test(root) && nameRgx.test(fileStats.name)) {
      console.log(root+'/'+fileStats.name);
      if(!demos.hasOwnProperty(parts[1])) {
        demos[parts[1]] = {};
      }
      if(!demos[parts[1]].hasOwnProperty(parts[2])){
        demos[parts[1]][parts[2]] = [];
      }

      demos[parts[1]][parts[2]].push(fileStats.name);

    }
    //demos.push(baseURL+URLparts[1].replace(/ /g, '%20')+'/'+URLparts[2]+'/'+fileStats.name);

    next();
  });

  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });

  walker.on("end", function () {
    logger.end();
    console.log("all done");
    fs.writeFile('./demofiles.json', JSON.stringify(demos, null, 2) , 'utf-8', (err) => {err && console.log(err)});
  });
}());
