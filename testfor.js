var fs = require('fs');
var exec = require('child_process').exec
var num = Math.ceil(Math.random() * 100)
fs.writeFileSync('test1.txt', num, 'utf8');
console.log(exec);
exec("git add .", function(error, stdout, stderr){
	console.log(stdout);
});
exec("git commit -m " + num, function(error, stdout, stderr){
	console.log(stdout);
});
function push(){
	exec("git push origin master", function(error, stdout, stderr){
	console.log('1', stdout);
	console.log('2', error);
	console.log('3', stderr);
})
}
setTimeout(push,3000);
// exec('git add .');
// exec("git commit -m");
// exec('git push origin master');