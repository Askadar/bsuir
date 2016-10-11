// net library for communication with server, readline for communication with user
const dgram = require('dgram');
const readline = require('readline');
//deafult address
const port = 8080;
const host = 'localhost';
//create interfaces for readlne to work
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//create and describe client behavior
const client = dgram.createSocket('udp4', (msg, rinfo)=>{
	console.log('Response: ', msg.toString());
});

rl.question('Message to send: ', answer=>{
	client.send(answer, 0, answer.length, port, host, (err, bytes)=>{
		err && console.log(err);
		console.log(`Sample message was sent to ${host}:${port}`);
	})	
})


