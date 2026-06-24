// 3/6/2026 Alpha 1.0

// ollama chat
const ollama = require('ollama');

// Import necessary discord.js classes
const fs = require('node:fs'); // file system from node
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, MessageFlags} = require('discord.js');
const {token} = require('./config.json'); // import token from config.json

// New Haruki bot client instance
const haruki_client = new Client({ intents: [GatewayIntentBits.Guilds]});

// on ready event (moved to Events/ready.js)
// haruki_client.once(Events.ClientReady, (readyClient) => {
//     console.log(`Haruki client is ready! Logged in as ${readyClient.user.tag}`);
// });

haruki_client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command){
            haruki_client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required data or execute property.`)
        }
    }
}

// Command handler
haruki_client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Event handler
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventsFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once){
        haruki_client.once(event.name, (...args) => event.execute(...args));
    } else{
        haruki_client.on(event.name, (...args) => event.execute(...args));
    }
}

haruki_client.login(token);
 
