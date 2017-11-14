var fs = require('fs');
var times = process.argv[2];
console.log(`plan to push ${times} times`);
var exec = require('child_process').exec
var num = Math.ceil(Math.random() * 100)

//  first pull from repo to avoid the issue if other repo had push 
exec("git pull .", function(error, stdout, stderr){
	console.log('pull', stdout);
	//  second change some file
	fs.writeFileSync('test1.txt', num, 'utf8');
	// third add the changes
	exec("git add .", function(error, stdout, stderr){
		console.log('add', stdout);
		// forth commit the changes
		exec("git commit -m " + num, function(error, stdout, stderr){
			console.log('commit', stdout);
			// fifth push the commit
			exec("git push origin master", function(error, stdout, stderr){
				console.log('push', stdout);
				if (error) {
					console.log('push failed', error)
					return;
				}
				if (times > 1)
				{
					console.log('do it again');
					exec("node testfor " + (times - 1))
				}
			})
		});
	});
});




// function push(){

// }
// setTimeout(push,3000);
