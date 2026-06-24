// 24/6/2026 Alpha 1.1

const { SlashCommandBuilder } = require("discord.js");
const ollama = require("ollama").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aicommmand')
        .setDescription('Natural language processing into commands.')
        .addStringOption((option) => option.setName('message').setDescription('message to send to chat bot').setRequired(true)),
    async execute(interaction) {
        console.info(`Command <aicommand> invoked by ${interaction.user.username}`)

        var commands = "";
        const bannedCommands = ["aicommmand", "ai", "call", "testping"]; // Set commands to not appear as selection for the LLM

        // Create a list of commands for the LLM to choose
        for (const [name, command] of interaction.client.commands) {
            if (bannedCommands.includes(name)) {
                continue;
            }
            commands += `**${name}** - ${command.data.description}\n`;
        }
        // DEBUG
        // console.debug(commands);

        // System content for LLM context
        const sysContent =`
        Translate the user\'s message into a command.
        Here are the list of commands: ${commands},
        choose one of the commands that best fit the message, reply with the command itself like if you think **ping** is correct, say ping.
        If you do not know what to choose, say \'NIL\', no need any prefixes like / .
        
        `

        // 3 Tries for the LLM to get the most suitable command, or none at all. Mainly to check LLM sanity.
        var trycount = 0;
        while (trycount < 3){
            trycount += 1;
            const response = await ollama.chat({
                model: 'qwen2.5:3b',
                messages: [
                    {
                        role: 'system', content: sysContent,
                    },
                    {
                        role: 'user', content: interaction.options.getString('message')
                    }],
                stream: false
            });
            res = response.message.content;

            // DEBUG
            // console.debug(res);

            // No command related to the message the user sent
            if (res == 'NIL') {
                return interaction.reply("No command related, try again");
            }
            
            // Sanity check on LLM hallucinating a random command
            var command = interaction.client.commands.get(res);
            // DEBUG
            // console.debug(command);
            if (command) {
                break;
            }
        }

        // Meaning that the LLM is hallucinating a command
        // TODO: Need to find a way to way to change its mind to provide a NIL or the actual possible command.
        if (trycount == 3){
            return interaction.reply("No command related, try again");
        }
        console.info(`<aicommand> by ${interaction.user.username} is invoking <${res}>`)
        await command.execute(interaction);
    },
    global: true
}