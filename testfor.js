var fs = require('fs');
var exec = require('child_process').exec
var num = Math.ceil(Math.random() * 100)
fs.writeFileSync('test.txt', num, 'utf8');
console.log(exec);
exec('git add .', function(error, stdout, stderr){
	console.log(stdout);
});
// exec('git add .');
// exec("git commit -m");
// exec('git push origin master');