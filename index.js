const { Client, Partials, Collection, GatewayIntentBits, EmbedBuilder, Events, ButtonInteraction } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");
const  loadButtons  = require('./handlers/buttonHandler');
require('dotenv').config();

// Criando o client:
const client = new Client({
    events: [

        Events.GuildRoleCreate,
        Events.GuildRoleDelete,
        Events.GuildRoleUpdate,
        Events.GuildMemberAdd,
        Events.GuildMemberRemove,
    ],
    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [

        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
    presence: {
        activities: [{
            name: "monhas",
            type: 0
        }],
        status: 'dnd'
    }
});

// // Host para o bot:
// require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

    // Obtendo o token do bot:
    const AuthenticationToken = config.Client.Token;
    if (!AuthenticationToken) {
        console.warn("[CRASH] Token de autenticação para bot do Discord é necessário! adicione em config.js.".red)
        return process.exit();
    };

    // Handler:
    
    client.commands = new Collection();
    client.slash_commands = new Collection();
    client.user_commands = new Collection();
    client.message_commands = new Collection();
    client.modals = new Collection();
    client.events = new Collection();
    client.aliases = new Collection();
    client.buttons = new Collection();

module.exports = client; 
loadButtons(client);

["prefix", "application-commands", "events", "mongoose", "buttonHandler"].forEach((file) => {
    require(`./handlers/${file}`)(client, config);
});

// Logando o bot
client.login(AuthenticationToken)
    .catch((err) => {
        console.error("[CRASH] Ocorreu algum erro ao fazer o login no bot".red);
        console.error("[CRASH] Erro da API do Discord:" + err);
        return process.exit();
    });

// Handler errors:
process.on('unhandledRejection', async (err, promise) => {
    console.error(`[ANTI-CRASH] Unhandled Rejection/Rejeição não tratada: ${err}`.red);
    console.error(promise);
});