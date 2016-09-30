// net library for communication with server, readline for communication with user
const net = require('net');
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
const client = new net.Socket();

client.on('data', (data)=>{
	//console.log('Client received: ', data);
	console.log('Received from server (stringified in UTF-8): ', data.toString());
})

client.on('close', ()=>{
	console.log('Client disconnected');
})
client.on('error', (err)=>{
	console.log('Client received error: ', err);
	//throw err;
})

//connect to server
client.connect(port, host, ()=>{
	console.log(`Connected to ${host}:${port}`); //report about succesfull connection
	rl.question('Write your math numbers: ', (answer) => {
		var requestString = JSON.stringify(answer.replace(/[^0-9.,]+/g, '|').split('|').slice(0,2)); //  stringify array that we made from user input by removing everything but numbers and '.' ',' symbols and then splitting string by previously inserted token and slicing everything but first two numbers
	  	client.write(requestString);
		console.log('Sent to server: ', requestString);
	  rl.close();
	});
})
