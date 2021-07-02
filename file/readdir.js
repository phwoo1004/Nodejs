var testFolder = './data'; // ./ : 현재 directory
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist) {
  console.log(filelist);
})
