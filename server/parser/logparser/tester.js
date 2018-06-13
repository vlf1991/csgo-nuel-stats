const fs = require('fs');

var pl = require('./parser');

pl.parseLog('./kotnq2flog.log', (logs) => {
  if(logs != "Game not found") {
    logs.forEach((log, index) => {
      fs.writeFile('./results/kotnq2f'+index+'.json', JSON.stringify(log, null, 2) , 'utf-8', (err) => {err && console.log(err)});
    });
  }
});
