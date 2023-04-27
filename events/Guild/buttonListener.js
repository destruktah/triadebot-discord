const client = require("../../index");
const config = require("../../config/config.js");
const { EmbedBuilder } = require("discord.js"); // Importa a classe EmbedBuilder da biblioteca discord.js.
const { SetFormulario } = require('../../commands/slash/Admin/setformulario.js');
const mongoose = require('mongoose');


module.exports = { // Exporta um objeto que contém o nome do evento e a função executada quando o evento ocorre.
  
  name: "buttonListener",
    
/** 
    @param {ButtonInteraction} interaction
*/
}
    // Define a função que será executada quando o evento ocorrer.
    client.on('interactionCreate', async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId.startsWith('aceitar-')) {
          const userId = interaction.customId.split('-')[1];
          const butao = interaction.customId.split('-')[0];
          console.log(userId);
          console.log(butao);
          interaction.customId = butao;
          const guildId = interaction.guildId;
          await SetFormulario.findOneAndUpdate({ guildId: guildId, recrutadoId: userId });
          console.log(`Botão ${interaction.customId} pressionado pelo usuário ${interaction.user.tag}`);
        }
        if (interaction.customId.startsWith('rejeitar-')) {
          const userId = interaction.customId.split('-')[1];
          const butao = interaction.customId.split('-')[0];
          console.log(userId);
          console.log(butao);
          interaction.customId = butao;
          const guildId = interaction.guildId;
          await SetFormulario.findOneAndUpdate({ guildId: guildId, recrutadoId: userId });
          console.log(`Botão ${interaction.customId} pressionado pelo usuário ${interaction.user.tag}`);
        }
        if (!interaction.isButton()) {
          console.log(`A interação não é um botão.`);
          return;
        }
    
        const button = client.buttons.get(interaction.customId);
       
        if (!button) {
          console.log(`O botão ${interaction.customId} não existe.`);
          return;
        }
    
        if (button == undefined) {
          console.log(`O botão ${interaction.customId} é indefinido.`);
          return;
        }
        
        if (button.permission && !interaction.member.permissions.has(button.permission)) {
          console.log(`O usuário ${interaction.user.tag} não tem permissão para usar o botão ${interaction.customId}.`);
          return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | You don't have the required permissions to use this.`).setColor("#f8312f") ], ephemeral: true });
        }
    
        if (button.developer && interaction.user.id !== "796182619615526912") {
          console.log(`O botão ${interaction.customId} é apenas para desenvolvedores e o usuário ${interaction.user.tag} não é um desenvolvedor.`);
          return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | This button is for developers only.`).setColor("#f8312f") ], ephemeral: true });
        }
    
        button.execute(interaction, client);
      }
    });