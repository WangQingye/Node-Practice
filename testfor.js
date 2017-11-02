var fs = require('fs');
var times = process.argv[2];
console.log(times);
var exec = require('child_process').exec
console.log(exec);
var num = Math.ceil(Math.random() * 100)
fs.writeFileSync('test1.txt', num, 'utf8');

exec("git add .", function(error, stdout, stderr){
	console.log('add', stdout);
	exec("git commit -m " + num, function(error, stdout, stderr){
	console.log('commit', stdout);
	});
});

function push(){
	exec("git push origin master", function(error, stdout, stderr){
		console.log('push', stdout);
		if (error) {
			console.log('push failed', error)
			return;
		}
		if (times >= 1)
		{
			console.log('do it again');
			exec("node testfor " + (times - 1))
		}
	})
}
setTimeout(push,3000);
