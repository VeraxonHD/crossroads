require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Sequelize = require("sequelize");

/* CLIENT CONSTRUCTOR */
const client = new Client({
    partials: ["MESSAGE", "REACTION", "CHANNEL"],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessages]
});

/* SETUP SEQUELIZE */
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
    define: {
        freezeTableName: true
    },
    logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

client.sequelize = sequelize;

const modelsPath = path.join(__dirname, 'models');
const modelsFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));;

for (const file of modelsFiles) {
	const filePath = path.join(modelsPath, file);
	const modelFile = require(filePath);
	console.log(`[SQLINIT] Loaded SQL (Sequelize) model ${file.split('.js')[0]}`);
	console.log(modelFile.init(sequelize));
}

/* COMMAND HANDLER */
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`[CMDINIT] Loaded command ${command.data.name} successfully`);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

/* EVENT HANDLER */
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(`[EVTINIT] Loaded event handler ${event.niceName} for Event Type ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.DISCORD_TOKEN);