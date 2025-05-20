const fetch = require('node-fetch');
const fs = require('fs');
const ms = require("ms")

const activeIntervals = [];

module.exports = async function sendMessagesInGuild(tokens, guildId, message) {
  if (!guildId || typeof guildId !== 'string') {
    return console.error('❌ Le guildId doit être une chaîne valide.');
  }

  if (!message || typeof message !== 'string') {
    return console.error('❌ Le message doit être une chaîne de caractères.');
  }

  const validTokens = [];

  for (const token of tokens) {
    try {
      const meRes = await fetch(`https://discord.com/api/v10/users/@me`, {
        headers: { Authorization: token }
      });

      if (!meRes.ok) {
        const errText = await meRes.text();
        console.warn(`🚫 Token invalide : ${token.slice(0, 10)}... → ${errText}`);
        continue;
      }

      const userData = await meRes.json();
      console.log(`✅ Token valide : ${userData.username} (${userData.id})`);
      validTokens.push({ token, user: userData });

    } catch (err) {
      console.warn(`❌ Erreur lors de la tentative de connexion avec ${token.slice(0, 10)}... →`, err.message);
    }
  }

  if (!validTokens.length) {
    console.log('❌ Aucun token valide. Arrêt.');
    return;
  }

  for (const { token, user } of validTokens) {
    try {
      const guildsRes = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
        headers: { Authorization: token }
      });

      const guilds = await guildsRes.json();
      const isInGuild = guilds.some(g => g.id === guildId);

      if (!isInGuild) {
        console.warn(`🚫 ${user.username} (${user.id}) n’est pas dans le serveur ${guildId}`);
        continue;
      }

      const chanRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: token }
      });

      const channels = await chanRes.json();

      const textChannels = channels.filter(c =>
        c.type === 0 &&
        c.permissions &&
        (BigInt(c.permissions) & BigInt(0x800)) !== BigInt(0)
      );

      for (const channel of textChannels) {
        const interval = setInterval(async () => {
          try {
            const sendRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
              method: 'POST',
              headers: {
                Authorization: token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ content: message })
            });

            if (sendRes.ok) {
              console.log(`📨 ${user.username} → #${channel.name}`);
            } else {
              const errorText = await sendRes.text();
              console.warn(`⚠️ ${user.username} → Erreur dans #${channel.name}: ${errorText}`);
            }
          } catch (err) {
            console.error(`❌ ${user.username} → Erreur envoi #${channel.name}: ${err.message}`);
          }
        }, ms('5s')); 

        activeIntervals.push(interval);
      }

    } catch (err) {
      console.error(`❌ ${user.username} → Erreur de récupération des salons : ${err.message}`);
    }
  }

  fs.watchFile('stop.txt', (curr, prev) => {
    if (curr.size > 0 || curr.mtimeMs !== prev.mtimeMs) {
      console.log('🛑 Fichier stop.txt détecté. Arrêt de tous les envois...');
      for (const interval of activeIntervals) clearInterval(interval);
      fs.unwatchFile('stop.txt');
    }
  });
};
