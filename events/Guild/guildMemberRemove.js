const { EmbedBuilder } = require("@discordjs/builders"); // importa a classe EmbedBuilder do pacote @discordjs/builders
const client = require("../../index"); // importa o objeto client do arquivo index.js presente na pasta superior
const config = require("../../config/config.js"); // importa o arquivo de configuração config.js presente na pasta config
const { GuildMember, Embed } = require("discord.js"); // importa as classes GuildMember e Embed do pacote discord.js
const mongoose = require('mongoose'); // importa o pacote mongoose, utilizado para trabalhar com banco de dados MongoDB
const SetSaida = require("../../commands/slash/Admin/setsaida").SetSaida; // importa o modelo SetSaida presente no arquivo setSaida.js

module.exports = {
  name: "guildMemberRemove" // nome do evento
};

client.on('guildMemberRemove', async (member) => { // ouve o evento guildMemberRemove, passando o parâmetro member que representa o membro que saiu
  console.log(`${member.user.tag} saiu servidor!`); // loga no console o nome de usuário e a tag do membro que saiu
  const latestSetSaida = await SetSaida.findOne(); // busca o último documento da coleção SetSaida

  if (latestSetSaida && latestSetSaida.channelId) { // verifica se há um documento SetSaida na coleção e se contém um channelId definido
    const setSaidaChannel = await client.channels.fetch(latestSetSaida.channelId); // busca o canal de saída definido pelo channelId

    if (setSaidaChannel) { // verifica se o canal foi encontrado com sucesso
      const memberCount = (await member.guild.members.fetch()).filter(member => !member.user.bot).size; // busca a contagem de membros do servidor, exceto bots
      const saidaMessage = `<@${member.id}> abandonou a tropa da Tríade`; // mensagem de saída do membro
      const saidaEmbed = new EmbedBuilder() // cria um objeto EmbedBuilder para construir um embed de mensagem de saída
        .setTitle("Membro saiu")
        .setDescription(saidaMessage)
        .setColor(0x037821) // define a cor da borda do embed em hexadecimal
        .addFields({ name: 'Número de membros', value: `${memberCount}` }) // adiciona um campo ao embed com a contagem de membros
        .setTimestamp(); // adiciona um timestamp ao embed

      setSaidaChannel.send({ embeds: [saidaEmbed.toJSON()] }); // envia o embed para o canal de saída definido
    }
  }
});