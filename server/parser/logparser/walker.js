(function () {
  "use strict";

  var walk = require('walk');
  var fs = require('fs');
  var options;
  var walker;
  var pl = require('./parser');

  var warwick = [], lancaster = [];
  var wwg = {week: 0, count: 1};
  var lag = {week: 0, count: 1};

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
    var pathRgx = /^\.\/logs\/\\w(\d)\\(\d+)\\logfiles\\L010_000_000_004_27015_(\d{4}\d{2}\d{2})(\d{4})_\d\d\d\.log$/;
    if(pathRgx.test(root+'\\'+fileStats.name)) {
      pl.parseLog(root+'\\'+fileStats.name, (logs) => {
        //console.log(logs.length);
        if(logs != "Game not found") {
          logs.forEach((log, index) => {
            var pathbits = log.path.match(pathRgx);
            var newname = 'week'+pathbits[1]+'-game';
            if(log.players.hasOwnProperty('STEAM_1:1:37718758')) {
              console.log(root+'\\'+fileStats.name);
              //warwick.push(log);
              if(wwg.week === pathbits[1]) {
                wwg.count = 2;
              } else {
                wwg.count = 1;
              }
              wwg.week = pathbits[1];
              fs.writeFileSync('./results/ww/'+newname+wwg.count+'.js', 'var logfile = '+JSON.stringify(log, null, 2)+'; \n export default logfile;' , 'utf-8', (err) => {err && console.log(err)});
            } if(log.players.hasOwnProperty('STEAM_1:1:41436345')) {
              console.log(root+'\\'+fileStats.name);
              //lancaster.push(log);
              if(lag.week === pathbits[1]) {
                lag.count = 2;
              } else {
                lag.count = 1;
              }
              lag.week = pathbits[1];
              fs.writeFileSync('./results/lanc/'+newname+lag.count+'.js', 'var logfile = '+JSON.stringify(log, null, 2)+'; \n export default logfile;' , 'utf-8', (err) => {err && console.log(err)});
            }
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
    //fs.writeFile('./results/warwick.js', JSON.stringify(warwick, null, 2) , 'utf-8', (err) => {err && console.log(err)});
    //fs.writeFile('./results/lancaster.js', JSON.stringify(lancaster, null, 2) , 'utf-8', (err) => {err && console.log(err)});
    //fs.writeFile('./results/wwlanc.js', JSON.stringify({warwick: warwick, lancaster: lancaster}, null, 2) , 'utf-8', (err) => {err && console.log(err)});
    logger.end();
    console.log("all done");
  });
}());
