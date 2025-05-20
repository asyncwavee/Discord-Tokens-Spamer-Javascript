require('dotenv').config();
const sendMessagesInGuild = require('./utils/sendInTextChannels');

const TOKENS = process.env.TOKENS.split(',').map(t => t.trim()).filter(Boolean);
const GUILD_ID = process.env.GUILD_ID;
const MESSAGE = process.env.MESSAGE;

if (!TOKENS.length) {
  console.error('❌ Aucun token fourni dans .env');
  process.exit(1);
}

if (!GUILD_ID || !MESSAGE) {
  console.error('❌ GUILD_ID ou MESSAGE manquant dans .env');
  process.exit(1);
}

sendMessagesInGuild(TOKENS, GUILD_ID, MESSAGE);
