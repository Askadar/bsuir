// net library for communication with server, readline for communication with user
const net = require('net');
const readline = require('readline');
//deafult address
const port = 8080;
const host = 'localhost';
//menu text
function menuText(data){
	const menu = `[Show] - output list of details; 
[Add](detail name, detail count, manufacturer ID) - add a detail to list, returns detail id on success; 
[Edit](detail name or id) - edit detail in list found by id or name; 
[Delete](detail id or name) - delete detail from list
[(detail name)] - output selected detail data
[Exit] - end connection and exit
`;
	const input = '\nInput: '
	return data ? menu+'Response: '+data+input : menu+input;
}
//create interfaces for readlne to work
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
//create and describe client behavior
const client = new net.Socket();

client.on('data', (data)=>{
	//console.log('Client received: ', data);
	//console.log('Response: ', data.toString());
	let action =JSON.parse(data.toString());
	if (action.type == 'response')
		menu(action.response);
	else{
		switch (action.type){
			case 'edit':
			break;
			case 'delete':
			break;
		}
	}
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
function menu(data){
	//print out menu
	rl.question(menuText(data), (answer) => {
			switch(answer.toLowerCase()){
				case 'show':
					client.write(JSON.stringify({type:'show'}));
				break;
				case 'add':
					rl.question('Enter detail name, quantity and manufacturer ID [delimited by space]: ', (answer) => {
						client.write(JSON.stringify({type:'add', data: answer.split(' ')}));
					})
				break;
				case 'edit':				
					rl.question('Enter detail name, quantity and manufacturer ID [delimited by space]: ', (answer) => {
						client.write(JSON.stringify({type:'add', data: answer.split(' ')}));
					})
					client.write(JSON.stringify({type:'edit'}));
				break;
				case 'delete':
					client.write(JSON.stringify({type:'delete'}));
				break;
				case 'exit':
					rl.close()
					client.end();
				break;
				default:
					client.write(JSON.stringify({type:'stuff'}));
			}
		}
	);
}