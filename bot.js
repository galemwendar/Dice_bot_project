const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with the token you received from BotFather
const token = '6270673527:AAGI-Nc_9XBLyKbfz159evFRjO2Lo7vE17M';

// Create a new instance of the Telegram Bot
const bot = new TelegramBot(token, { polling: true });

// Check connection with Telegram Bot API
bot.getMe().then((botInfo) => {
    console.log(`Bot connected to Telegram. Bot username: @${botInfo.username}`);
}).catch((error) => {
    console.error('Failed to connect to Telegram:', error);
});

// Store the command and its parameters in a separate object
const commandData = {};

function rollDice(numDice, numSides) {
    let result = '';
    let total = 0;

    for (let i = 0; i < numDice; i++) {
        const diceResult = Math.floor(Math.random() * numSides) + 1;
        result += `Dice ${i + 1}: ${diceResult}\n`;
        total += diceResult;
    }

    result += `Total: ${total}`;
    return result;
}

// Handle '/roll' command with parameters
bot.onText(/\/roll\s*(\d*)d?(\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const numDice = match[1] === '' ? 1 : parseInt(match[1]);
    const numSides = parseInt(match[2]);

    const rollResult = rollDice(numDice, numSides);

    console.log(`Received roll command: /roll ${match[0]}`);
    console.log(`Dice roll result: ${rollResult}`);

    // Store the command and its parameters
    commandData[chatId] = {
        command: `/roll ${match[0]}`,
        numDice: numDice,
        numSides: numSides
    };

    const inlineKeyboard = [
        [
            { text: 'Roll Again', callback_data: 'roll_again' }
        ]
    ];

    bot.sendMessage(chatId, rollResult, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Roll Again', callback_data: 'roll_again' }
                ]
            ]
        }
    });
});




// Log the requests
bot.on('polling_error', (error) => {
    console.log(`Polling error: ${error}`);
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
  
    console.log(`Received callback query: ${data}`);
  
    if (data === 'roll_again') {
      const command = commandData[chatId];
  
      if (command) {
        const numDice = command.numDice;
        const numSides = command.numSides;
  
        const rollResult = rollDice(numDice, numSides);
  
        console.log(`Roll Again action triggered: ${command.command}`);
        console.log(`Dice roll result: ${rollResult}`);
  
        const messageText = `${command.command}\n\n${rollResult}`;
  
        const inlineKeyboard = [
          [
            {
              text: 'Roll Again',
              callback_data: 'roll_again',
            },
          ],
        ];
  
        bot.sendMessage(chatId, messageText, {
          reply_markup: {
            inline_keyboard: inlineKeyboard,
          },
        });
      }
    }
  });
  
