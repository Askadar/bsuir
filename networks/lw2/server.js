// library for client-server relations
const net = require('net');
// port that will be used
const port = 8080;
//creating server with anonymous callback for new connections
const server = net.createServer(socket => {
	console.log('Connection accepted');
	//handler for proper connection end
	socket.on('end', () => {
		console.log('Connection closed');
	})
	//handler for errors and lost connections
	socket.on('error', (err) => {
		if (err.code == 'ECONNRESET')
			console.log('TCP connection ended abruptly');
		else
			console.log(err);
		//throw err;
	})
	// handler for received data
	socket.on('data', data => {
		//console.log('Received data from client: ', data);
		console.log('Request: ', data.toString()); //logging received data translated from Buffer object to simple utf-8 string, we're hoping for JSONed array with 2 numbers
		try{
			var parsedData = JSON.parse(data.toString());
		}
		catch (err){
			console.log(`Data is corruptedd or isn't JSON {${err}}`);
			socket.write('Wrong input, waiting for JSONed action (Action {type:\'x\', data:{}})');
			return;
		}
		let response = reducer(parsedData);
		console.log(response);
		socket.write(response);
		
	})
	//socket.write('Hello from server');
	//console.log('dev',socket.pipe);
	//socket.pipe(socket);
})
server.listen(port, () => {
	// onlisten event handler - log succesfull port binding
	console.log(`Server started listening on port ${port}. Hello from listenig callback`);
})

//'reducer' function, global state for now
var state = [{id:0, name:'Nail', quantity:1978, manufacturer: 693},
			{id:1, name:'Screw', quantity:1703, manufacturer: 693},
			{id:2, name:'Plug', quantity:126, manufacturer: 446},
			{id:5, name:'Nail', quantity:612, manufacturer: 335},
			{id:6, name:'Hinge', quantity:1989, manufacturer: 446},
			{id:7, name:'Screw', quantity:2387, manufacturer: 446},
			{id:8, name:'Oil', quantity:98000, manufacturer: 693},
			{id:11, name:'Straw', quantity:78490, manufacturer: 335}]
function reducer(action){
	switch (action.type){
		case 'show':
			return JSON.stringify({response:'Details: ',type: 'show', data: state});
		break;
		case 'add':
			state.push({id:state[state.length-1].id+1, name: action.data[0], quantity: action.data[1], manufacturer:  action.data[2]})
			return JSON.stringify({response:'Succesfuly added '+action.data.name, type: 'add'})
		break;
		case 'edit':
			if (action.data.length < 2){
				let foundRows = state.filter(a => a.id == action.data[0] || a.name == action.data[0]).map(row => 'manufacturer: '+row.manufacturer+' | '+row.id+' - '+row.quantity).join('\n');
				let completeResponse = foundRows.length > 1 ? 'Found this material(s):\n'+foundRows+'\n[enter id and new quantity to edit]:' : 'No materials found';
				return JSON.stringify({response: completeResponse, type:'edit', data:foundRows})
			}
			else {
				let id;
				state.map((a,b) => { if(a.id == action.data[0]) id = b;});
				state[id].quantity = action.data[1];
				return JSON.stringify({type: 'edit', response: 'success', })
			}
		break;
		case 'delete':
			if (typeof action.data[0] != 'number' && action.data[1] != 'confirm'){
				let foundRows = state.filter(a => a.id == action.data[0] || a.name == action.data[0]).map(row => 'manufacturer: '+row.manufacturer+' | '+row.id+' - '+row.quantity).join('\n');
				let completeResponse = foundRows.length > 1 ? 'Found this material(s):\n'+foundRows+'\n[enter id and new quantity to edit]:' : 'No materials found';
				return JSON.stringify({response: completeResponse, type:'delete', data:foundRows})
			}
			else {
				let id;
				state.map((a,b) => { if(a.id == action.data[0]) id = b;});
				state.splice(id,1);
				return JSON.stringify({type: 'delete', response: 'success', })
			}
		break;
		case 'stuff':
			return JSON.stringify({response:'Info about detail(s): ', data: state.filter(a => a.name == action.data || a.id == action.data), type: 'stuff'})
		break;
		default:
			return Object.assign(action, {type: 'error', response: 'wrong action type provided'})
	}
}