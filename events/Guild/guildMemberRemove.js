// Importar as dependências necessárias
const { EmbedBuilder } = require("@discordjs/builders");
const client = require("../../index");
const config = require("../../config/config.js");
const { GuildMember, Embed } = require("discord.js");
const mongoose = require('mongoose');
const { SetSaida } = require('../../commands/slash/Admin/setsaida');

// Exportar o módulo
module.exports = {
  name: "guildMemberRemove"
};

// Definir um evento para quando um membro sai do servidor
client.on('guildMemberRemove', async (member) => {
  if (member.user.bot) {
    return; // Retorna se o membro que saiu for um bot
  }
  console.log(`Novo membro ${member.user.tag} juntou-se ao servidor!`);

  // Obter o canal de saida correto para o servidor correcto
  const setSaida = await SetSaida.findOne({ guildId: member.guild.id });
  if (!setSaida) {
    console.error(`Canal de saida não definido para o servidor ${member.guild.name}`);
    return;
  }

  const channel = member.guild.channels.cache.get(setSaida.channelId);
  if (!channel) {
    console.error(`Canal de saida não encontrado para o servidor ${member.guild.name}`);
    return;
  }

  // Obter o número de membros do servidor e de membros verificados
  const memberCount = (await member.guild.members.fetch()).filter(member => !member.user.bot).size; // busca a contagem de membros do servidor, exceto bots
  
  // Construir a mensagem de saida
  
  const saidaMessage = `<@${member.id}> abandonou a tropa da Tríade`; // mensagem de saída do membro
  const saidaEmbed = new EmbedBuilder() // cria um objeto EmbedBuilder para construir um embed de mensagem de saída
    .setTitle("Membro saiu")
    .setDescription(saidaMessage)
    .setColor(0xED4245) // define a cor da borda do embed em hexadecimal
    .addFields({ name: 'Número de membros', value: `${memberCount}` }) // adiciona um campo ao embed com a contagem de membros
    .setTimestamp(); // adiciona um timestamp ao embed

  // Enviar a mensagem de saida no canal de entrada
  channel.send({ embeds: [saidaEmbed.toJSON()] });
});