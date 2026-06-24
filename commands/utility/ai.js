// 3/6/2026 Alpha 1.0

const { SlashCommandBuilder } = require("discord.js");
const ollama = require("ollama").default;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('replies from a chat bot.')
    .addStringOption((option) => option.setName('message').setDescription('chat with the bot').setRequired(true)),
    async execute(interaction){
        console.info(`Command <chat> invoked by ${interaction.user.username}`)
        await interaction.reply('thinking...') // Show function is running
        const response = await ollama.chat({
            model:'qwen2.5:3b',
            messages: [
                {
                    role:'system', content: 'Keep  your response up to 50 words.'
                },
                {
                    role:'user', content: interaction.options.getString('message')
                }],
                stream: true // Enable streaming for in real time generation
        });

        // Edits the mesage for every part of response generated
        var msg = '';
        for await (const part of response) {
            msg += part.message.content;
            await interaction.editReply(msg);
        }
    },
    global: true
}