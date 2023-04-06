// Importar as dependências necessárias
const { EmbedBuilder } = require("@discordjs/builders");
const client = require("../../index");
const config = require("../../config/config.js");
const mongoose = require('mongoose');
const { SetEntrada } = require('../../commands/slash/Admin/setentrada');
const { SetVerificar } = require('../../commands/slash/Admin/setverificar');

// Exportar o módulo
module.exports = {
  name: "guildMemberAdd"
};

// Definir um evento para quando um novo membro entrar no servidor
client.on('guildMemberAdd', async (member) => {
  console.log(`Novo membro ${member.user.tag} juntou-se ao servidor!`);

  // Obter o canal de entrada correto para o servidor correto
  const setEntrada = await SetEntrada.findOne({ guildId: member.guild.id });
  if (!setEntrada) {
    console.error(`Canal de entrada não definido para o servidor ${member.guild.name}`);
    return;
  }

  const channel = member.guild.channels.cache.get(setEntrada.channelId);
  if (!channel) {
    console.error(`Canal de entrada não encontrado para o servidor ${member.guild.name}`);
    return;
  }

  // Obter o número de membros do servidor exceto bots
  const memberCount = (await member.guild.members.fetch()).filter(member => !member.user.bot).size; 

  // Obter o número de membros com a role de verificado, se estiver definida
  let membersWithRoles = 0;
  const setVerificar = await SetVerificar.findOne({ guildId: member.guild.id });
  if (setVerificar && setVerificar.roleId && setVerificar.channelId) {
    const role = member.guild.roles.cache.get(setVerificar.roleId);
    if (role) {
      membersWithRoles = role.members.size;
    }
  }

  // Construir a mensagem de boas-vindas
  const verifyChannel = member.guild.channels.cache.get(setVerificar.channelId)
  let welcomeMessage = `Bem-vindo <@${member.id}> ao servidor. Para se tornar um membro do servidor, vá para o canal <#${verifyChannel.id}> para fazer a sua verificação!`;
  if (!setVerificar || !setVerificar.roleId) {
    welcomeMessage = `Bem-vindo <@${member.id}> ao servidor.`;
  }

  const welcomeEmbed = new EmbedBuilder()
    .setTitle("Novo membro!")
    .setDescription(welcomeMessage)
    .setColor(0x037821)
    .addFields(
      { name: 'Número de utilizadores no servidor', value: `${memberCount}` }
    );

  // Adicionar o campo de membros verificados, caso haja uma role de verificado definida
  if (setVerificar && setVerificar.roleId) {
    welcomeEmbed.addFields(
      { name: "Número de Verificados no servidor", value: `${membersWithRoles}` }
    );
  }

  welcomeEmbed.setTimestamp();

  // Enviar a mensagem de boas-vindas no canal de entrada
  channel.send({ embeds: [welcomeEmbed.toJSON()] });
});
