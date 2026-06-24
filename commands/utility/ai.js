// 3/6/2026 Alpha 1.0

const { SlashCommandBuilder } = require("discord.js");
const ollama = require("ollama").default;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('replies from a chat bot.')
    .addStringOption((option) => option.setName('message').setDescription('message to send to chat bot').setRequired(true)),
    async execute(interaction){
        await interaction.reply('thinking...')
        const response = await ollama.chat({
            model:'qwen2.5:3b',
            messages: [
                {
                    role:'system', content: 'Keep  your response up to 50 words.'
                },
                {
                    role:'user', content: interaction.options.getString('message')
                }],
                stream: true
        });
        var msg = '';
        for await (const part of response) {
            msg += part.message.content;
            await interaction.editReply(msg);
        }
    },
    global: true
}