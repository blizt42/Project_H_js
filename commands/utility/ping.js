// 3/6/2026 Alpha 1.0

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    async execute(interaction){
        await interaction.reply('Pong!');
    },
    global: true
}