var fs = require('fs');
var exec = require('child_process').exec
fs.writeFileSync('test', './file/test.txt', 'utf8');
exec('git add .');
exec("git commit -m 'test'");
exec('git push origin master');