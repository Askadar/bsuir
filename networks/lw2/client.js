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
	return data ? menu+data+input : menu+input;
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
	switch (action.type){
		case 'show':
			menu(action.response+(action.data.length > 0 ? action.data.map(a=>a.name).join(', ') : 'none'));
		break;
		case 'add':
			menu(action.response);
		break;
		case 'edit':
			if(action.response != 'success')
				rl.question(action.response, answer=>{
					client.write(JSON.stringify({type:'edit', data: answer.split(' ')}))
				})
			else
				menu('Successful edit');
		break;
		case 'delete':
			if(action.response != 'success')
				rl.question(action.response, answer=>{
					if (answer.toLowerCase() != 'cancel')
						client.write(JSON.stringify({type:'delete', data: [answer,'confirm']}))
					else
						menu('Delete canceled')
				})
			else
				menu('Successful delete');      
		break;
		case 'stuff':
			var info = '\n';
			console.log(action);
			action.data.map(row => {
				var textRow = ''
				Object.keys(row).map(k => {
					textRow += k+' - '+row[k]+ (k != 'manufacturer' ? ', ' :'');
					//console.log('first tr', textRow, row, k, row[k]);
				})
				//console.log('second tr', textRow, info);
				info += textRow+'\n';
			})
			console.log(info);
			menu(action.response+info.slice(0,-1))
		break;
		default:
			menu('Server responded with corrupted action')
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
					rl.question('Enter detail name to edit: ', (answer) => {
						client.write(JSON.stringify({type:'edit', data: answer.split(' ')}));
					})
					//client.write(JSON.stringify({type:'edit'}));
				break;
				case 'delete':
					rl.question('Enter detail name to delete: ', (answer) => {
						client.write(JSON.stringify({type:'delete', data: answer.split(' ')}));
					})
				break;
				case 'exit':
					rl.close()
					client.end();
				break;
				default:
					client.write(JSON.stringify({type:'stuff', data: answer}));
			}
		}
	);
}