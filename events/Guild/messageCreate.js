// Importando os módulos necessários
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const Discord = require("discord.js");

// Exportando o nome do evento
module.exports = {
    name: "messageCreate"
};

// Escutando o evento de criação de mensagens
client.on('messageCreate', async (message) => {
    // Verificando se a mensagem não foi enviada em um canal DM (Direct Message)
    if (message.channel.type !== 0) return;

    // Verificando se a mensagem foi enviada por um bot
    if (message.author.bot) return;

    // Obtendo o prefixo definido para o servidor ou usando o prefixo padrão do bot
    const prefix = await db.get(`guild_prefix_${message.guild.id}`) || config.Client.Prefixo || "?";

    // Verificando novamente se a mensagem foi enviada por um bot
    if (message.author.bot) return;

    // Verificando se a mensagem não foi enviada em um canal DM (Direct Message)
    if (message.channel.type === Discord.ChannelType.DM) return;

    // Verificando se a mensagem começa com o prefixo definido ou o prefixo padrão do bot
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()))
    if (!message.content.startsWith(prefix)) return;

    // Verificando se a mensagem foi enviada em um servidor
    if (!message.guild) return;

    // Obtendo as informações do membro que enviou a mensagem
    if (!message.member) message.member = await message.guild.fetchMember(message);

    // Separando o comando e seus argumentos da mensagem
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    // Verificando se o comando existe ou se há um alias para ele
    if (cmd.length == 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // Verificando se o comando existe
    if (command) {
        // Verificando se o membro tem as permissões necessárias para executar o comando
        if (command.permissions) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) 
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`🚫・Infelizmente, você não está autorizado a usar este comando.`)
                    .setColor("Red")
                ]
            })
        };

        // Verificando se o comando é restrito apenas para os proprietários do bot
        if (command.owner, command.owner == true) {
        // Verificando se há proprietários definidos no arquivo de configuração
        if (!config.Users.OWNERS) return;

        // Criando um array vazio para armazenar os usuários permitidos a usar o comando
        const allowedUsers = [];

        // Iterando pelos IDs dos proprietários no arquivo config.js
config.Users.OWNERS.forEach(user => {
    // Obtendo o objeto do usuário com base no ID
    const fetchedUser = message.guild.members.cache.get(user);
    // Verificando se o usuário é válido, caso contrário, adiciona uma mensagem de erro
    if (!fetchedUser) 
        return allowedUsers.push('*Unknown User#0000*');
    // Adicionando o nome de usuário do usuário válido à lista de usuários permitidos
    allowedUsers.push(`${fetchedUser.user.tag}`);
})

// Verificando se o autor da mensagem é um dos proprietários permitidos
if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) 
    return message.reply({
        // Se não, responde com uma mensagem de erro indicando os usuários permitidos
        embeds: [ new EmbedBuilder()
            .setDescription(`🚫 Desculpe, mas apenas proprietários podem usar este comando! Usuários permitidos:\n**${allowedUsers.join(", ")}**`)
            .setColor("Red")
        ]
    })
};

try {
    // Executando o comando correspondente
    command.run(client, message, args, prefix, config, db);
} catch (error) {
    // Se ocorrer um erro, exibe uma mensagem de erro no console
    console.error(error);
};
    }});
