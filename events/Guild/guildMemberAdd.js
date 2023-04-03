// Importar as dependências necessárias
const { EmbedBuilder } = require("@discordjs/builders");
const client = require("../../index");
const config = require("../../config/config.js");
const { GuildMember, Embed } = require("discord.js");
const mongoose = require('mongoose');

// Importar os modelos para o conjunto de dados "SetEntrada" e "SetVerificar"
const SetEntrada = require("../../commands/slash/Admin/setentrada").SetEntrada;
const SetVerificar = require("../../commands/slash/Admin/setverificar").SetVerificar;

// Exportar o módulo
module.exports = {
  name: "guildMemberAdd"
};

// Definir um evento para quando um novo membro entrar no servidor
client.on('guildMemberAdd', async (member) => {
  console.log(`Novo membro ${member.user.tag} juntou-se ao servidor!`);
  
  // Obter os dados mais recentes de "SetEntrada" e "SetVerificar"
  const latestSetEntrada = await SetEntrada.findOne();
  const latestSetVerificar = await SetVerificar.findOne();
  
  // Obter o ID do canal de verificação
  const channelId = latestSetVerificar.channelId;
  
  // Se houver um canal definido em "SetEntrada", envie uma mensagem de boas-vindas
  if (latestSetEntrada && latestSetEntrada.channelId) {
    // Obter o canal definido em "SetEntrada"
    const setEntradaChannel = await client.channels.fetch(latestSetEntrada.channelId);

    // Verificar se o canal existe e se é o canal de boas-vindas do servidor
    if (setEntradaChannel && setEntradaChannel.id === member.guild.systemChannelId) {

      // Obter o número de membros verificados e não verificados no servidor
      const membersWithRoles = (await member.guild.members.fetch())
        .filter(member => !member.user.bot && member.roles.cache.size > 1).size;
      const memberCount = (await member.guild.members.fetch()).filter(member => !member.user.bot).size;

      // Construir a mensagem de boas-vindas
      const welcomeMessage = `Bem vindo <@${member.id}> ao servidor. Para se tornar um membro do servidor, vá para o canal <#${channelId}> para fazer a sua verificação!`;
      const welcomeEmbed = new EmbedBuilder()
        .setTitle("Novo membro!")
        .setDescription(welcomeMessage)
        .setColor(0x037821)
        .addFields(
          { name: 'Número de utilizadores no servidor', value: `${memberCount}` }, 
          { name: "Número de VERIFICADOS no servidor", value: `${membersWithRoles}`}
          )
        .setTimestamp();
      
      // Enviar a mensagem de boas-vindas no canal "SetEntrada"
      setEntradaChannel.send({ embeds: [welcomeEmbed.toJSON()] });
    }
  }
});