// 24/6/2026 Alpha 1.1

const { SlashCommandBuilder } = require("discord.js");
const { ping } = require("./ping.js");

module.exports = {
    data: new SlashCommandBuilder().setName('testping').setDescription('(Experimental) calls /ping replies with pong!'),
    async execute(interaction) {
        await ping(interaction);
    },
}