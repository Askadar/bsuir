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
		console.log('Request: ', JSON.parse(data.toString())); //logging received data translated from Buffer object to simple utf-8 string, we're hoping for JSONed array with 2 numbers
		try{
			var parsedData = JSON.parse(data.toString());
		}
		catch (err){
			console.log(`Data is corruptedd or isn't JSON {${err}}`);
			socket.write('Wrong input, waiting for JSONed action (Action {type:\'x\', data:{}})');
			return;
		}
		socket.write(JSON.stringify({type:'response', response: 'Success', data:parsedData}))
		
	})
	//socket.write('Hello from server');
	//console.log('dev',socket.pipe);
	//socket.pipe(socket);
})
server.listen(port, () => {
	// onlisten event handler - log succesfull port binding
	console.log(`Server started listening on port ${port}. Hello from listenig callback`);
})
