// library for client-server relations
const udp = require('dgram');
// port that will be used
const port = 8080;
//creating server with anonymous callback for new connections
const server = udp.createSocket('udp4', (msg,rinfo) => {
	msg = msg.toString();
	console.log('Message accepted'/*, msg*/);
	//console.log('Remote info', rinfo);
	let message;
	if (msg.length == 10){
		msg = msg.replace(/[A-Z]+/g,'');
		message = new Buffer(`Message changed: "${msg}"; chars removed: ${10-msg.length}`);
	}
	else
		message = new Buffer(`Message isn't 10 char long, nothing changed`);
	server.send(message, 0, message.length, rinfo.port, rinfo.address);
})
server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(8080, '127.0.0.1');