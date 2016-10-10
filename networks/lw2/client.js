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
	console.log('Response: ', data.toString());
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
	menu();
})
function menu(){
	rl.question(`[Show] - output list of details; 
		[Add](detail name, detail count, manufacturer ID) - add a detail to list, returns detail id on success; 
		[Edit](detail name or id) - edit detail in list found by id or name; 
		[Delete](detail id or name) - delete detail from list
		[(detail name)] - output selected detail data`, (answer) => {
			switch(answer.toLowerCase()){
				case 'show':
					client.write('show');
				break;
				case 'add':
					
				break;

			}
			var requestString = JSON.stringify(answer.replace(/[^0-9.,]+/g, '|').split('|').slice(0,2)); //  stringify array that we made from user input by removing everything but numbers and '.' ',' symbols and then splitting string by previously inserted token and slicing everything but first two numbers
				client.write(requestString);
			console.log('Sent to server: ', requestString);
		}
	);
}
function exit(){
	rl.close();
	client.end();
}