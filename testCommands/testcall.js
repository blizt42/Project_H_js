// 24/6/2026 Alpha 1.1

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('call').setDescription('(Experimental) calls the commands in the bot')
    .addStringOption((option) => option.setName('command').setDescription('run a command in the bot').setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString("command");
        const command = interaction.client.commands.get(commandName);

        if (!command){
            return interaction.reply({
                content: "Unknown command",
                ephemeral: true,
            });
        }

        await command.execute(interaction);
    },
}