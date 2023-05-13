const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with the token you received from BotFather
const token = '6270673527:AAGI-Nc_9XBLyKbfz159evFRjO2Lo7vE17M';

// Create a new instance of the Telegram Bot
const bot = new TelegramBot(token, { polling: true });

// Handle '/roll' command with parameters
bot.onText(/\/roll (\d+)d(\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const numDice = parseInt(match[1], 10); // Number of dice
  const numSides = parseInt(match[2], 10); // Number of sides

  let result = '';
  let total = 0;

  for (let i = 0; i < numDice; i++) {
    const diceResult = Math.floor(Math.random() * numSides) + 1;
    result += `Dice ${i + 1}: ${diceResult}\n`;
    total += diceResult;
  }

  result += `Total: ${total}`;

  bot.sendMessage(chatId, result);
});
