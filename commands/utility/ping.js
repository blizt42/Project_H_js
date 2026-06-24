// 24/6/2026 Alpha 1.1

const { SlashCommandBuilder } = require("discord.js");

// actual function to run ping
async function ping(interaction){
    console.info(`Command <ping> invoked by ${interaction.user.username}`)
    await interaction.reply('Pong!')
}

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    async execute(interaction){
        await ping(interaction);
    },
    ping, // export the ping function
    global: true
}