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
            console.log('Received data from client(stringified in UTF-8): ', data.toString()); //logging received data translated from Buffer object to simple utf-8 string, we're hoping for JSONed array with 2 numbers
			try{
	            var parsedData = JSON.parse(data.toString());
			}
			catch (err){
				console.log(`Data is corruptedd or isn't JSON {${err}}`);
				socket.write('Wrong input, waiting for JSONed array');
				return;
			}
            parsedData = parsedData.map(a => parseFloat(a)); //converting 2 strings to numbers
            console.log('Calculating');
            if (!isNaN(parsedData[0]) && !isNaN(parsedData[1])) { //check if 2 values are valid numbers and
                socket.write('Wait for your data to be calculated');
				// send client confirmation that his data is accepted and simulate calculations time
                setTimeout(() => {
					// calculate gcd
                    let a = parsedData[0],
                        b = parsedData[1];
                    while (a != 0 && b != 0) {
                        a > b ? a %= b : b %= a
                    };
                    socket.write('Your GCD: ' + (a + b));
                }, (Math.random() + 0.2) * 5000) //random time between 1 to 6 seconds, in ms
            } else {
                socket.write('Wrong input') //in case input isn't adequate deny client in calculating
            }

        })
        //socket.write('Hello from server');
        //console.log('dev',socket.pipe);
        //socket.pipe(socket);
})
server.listen(port, () => {
	// onlisten event handler - log succesfull port binding
    console.log(`Server started listening on port ${port}. Hello from listenig callback`);
})
