/*
 * Give the example of
 *   = how to read a file line by line
 *   = how to deal with parameter from command line.
 **/
var fs = require('fs'),
    readline = require('readline');

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var rd = readline.createInterface({
    input: fs.createReadStream(process.argv[2]),
    output: process.stdout,
    terminal: false
});

/*
rd.on('line', function(line) {
    console.log(line);
});
*/
