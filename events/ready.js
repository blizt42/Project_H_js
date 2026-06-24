// 3/6/2026 Alpha 1.0

const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client){
        console.log(`Haruki client is ready! Logged in as ${client.user.tag}`)
    }
}