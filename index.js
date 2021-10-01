//
//
//  __________    _____  _________  ____  __.__      __  _____ __________________    _________
//  \______   \  /  _  \ \_   ___ \|    |/ _/  \    /  \/  _  \\______   \______ \  /   _____/
//   |    |  _/ /  /_\  \/    \  \/|      < \   \/\/   /  /_\  \|       _/|    |  \ \_____  \ 
//   |    |   \/    |    \     \___|    |  \ \        /    |    \    |   \|    `   \/        \
//   |______  /\____|__  /\______  /____|__ \ \__/\  /\____|__  /____|_  /_______  /_______  /
//          \/         \/        \/        \/      \/         \/       \/        \/        \/ 
//                        qq--  This bot was scipted by Backwards_User__  --qq
//
//

// Backwards' Custom Music Bot

// Do to the unfortunate loss of many public music bots, such as Rythm, FredBoat, Groovy, etc. I have been forced to make one for a server I am apart of.
// This bot isn't very polished and it shouldn't be, as this is only a temporary solution until better bots (that use dedicated servers) return.

// This bot won't feature slash commands as I'm too lazy and They wouldn't be used anyways (because the server I use used Rythms prefix)

// The Code
// DO NOT TOUCH UNLESS YOU KNOW WHAT YOU ARE DOING!

// Declarations

const Discord = require('discord.js');
const client = new Discord.Client({ 'intents': ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'] });
const fs = require('fs')
const config = require('./config.js');

// Verifing the client is ready

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Commands

commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command)
};


client.on('messageCreate', msg => {
    if (!msg.content.startsWith(config.prefix)) return
    const args = msg.content.slice(config.prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    
    const command = commands.get(commandName) || commands.find(a => a.aliases && a.aliases.includes(commandName))

    if(command) command.execute(Discord, client, msg, args);
});

client.login(config.token);