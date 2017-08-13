var fs = require('fs');
var exec = require('child_process').exec
var num = Math.ceil(Math.random() * 10)
fs.writeFileSync('test.txt', num, 'utf8');
exec('git add .');
exec("git commit -m 'test'");
exec('git push origin master');