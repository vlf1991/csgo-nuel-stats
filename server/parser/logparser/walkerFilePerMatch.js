(function () {
  "use strict";

  var walk = require('walk');
  var fs = require('fs');
  var options;
  var walker;
  var pl = require('./parser');

  /*var demos = {};
  fs.readFile('demofiles.json', (err, data) => {
    if(err) throw err
    demos = JSON.parse(data);
  });

  function getDemoURL(w, s, a, b, map) {
    var baseURL = 'https://nuelgameserversnew.blob.core.windows.net/replays/2018%20Spring%20Week%20'+w+'/csgo-server-'+s+'/';
    if(demos.hasOwnProperty(w)) {
      if(demos[w].hasOwnProperty(s)) {
        demos[w][s].forEach((demo, index) => {
          var demoNameRgx = /^auto0-(\d{8})-(\d{4})\d{2}-\d+-(de_cache|de_cbble|de_inferno|de_mirage|de_nuke|de_overpass|de_train)-\w*\.dem$/;
          var demoParts = demo.match(demoNameRgx);
          if(demoParts[1] === a && demoParts[3] === map) {
            console.log(w+' '+s+' '+a+' '+demoParts[2]+' '+b);
            if(demoParts[2] === b) {
              console.log(demo);
              return baseURL + demo;
            } else if(Math.abs(parseInt(demoParts[2], 10) - parseInt(b, 10)) < 3) {
              console.log(demo);
              return baseURL + demo;
            }
          }
        });
      }
    }
    return null;
  }*/

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
    console.log(root+'\\'+fileStats.name);
    var pathRgx = /^\.\/logs\/\\w(\d)\\(\d+)\\logfiles\\L010_000_000_004_27015_(\d{4}\d{2}\d{2})(\d{4})_\d\d\d\.log$/;
    if(pathRgx.test(root+'\\'+fileStats.name)) {
      pl.parseLog(root+'\\'+fileStats.name, (logs) => {
        if(logs != "Game not found") {
          logs.forEach((log, index) => {
            var pathbits = log.path.match(pathRgx);
            var newname = 'w'+pathbits[1]+'-s'+pathbits[2]+'-'+pathbits[3]+'-'+pathbits[4]+'-'+log.map;
            fs.writeFileSync('./results/2018 Spring/'+newname+index+'.json', JSON.stringify(log, null, 2) , 'utf-8', (err) => {err && console.log(err)});
          });
        }
        next();
      });
    } else {
      next();
    }
  });

  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });

  walker.on("end", function () {
    logger.end();
    console.log("all done");
  });
}());
