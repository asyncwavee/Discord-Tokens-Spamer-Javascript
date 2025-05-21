# Discord Tokens Spammer

A script using Node.js and native Discord API calls (via `node-fetch`) to send messages in all the text channels of a server at regular intervals, using multiple user tokens.

> ⚠️ **I remind you that this code is for educational and demonstrative purposes.**  
> It was originally used to test the anti-spam system of the **Wardex Protection Bot**.  
> I am **not responsible** for any misuse of this script.

---

## 📦 Features

- ✅ Sends messages every minutes in all text channels of a specific guild
- ✅ Uses multiple user tokens
- ✅ Filters and displays only valid tokens
- ✅ Checks if tokens are in the server
- ✅ Skips channels where the token lacks `SEND_MESSAGES` permission
- ✅ Can be stopped by modifying the `stop.txt` file

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/votre-utilisateur/discord-tokens-spammer.git
cd discord-tokens-spammer
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure .env**
```bash
TOKENS=token1,token2,token3
GUILD_ID=123456789012345678
MESSAGE=Your message here
```

4. **Run the script**
```bash
npm start
```

