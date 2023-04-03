const client = require("../../index");
const config = require("../../config/config.js");
const { EmbedBuilder } = require("discord.js"); // Importa a classe EmbedBuilder da biblioteca discord.js.

module.exports = { // Exporta um objeto que contém o nome do evento e a função executada quando o evento ocorre.
  name: "buttonListener",
    }
    // Define a função que será executada quando o evento ocorrer.
    client.on('interactionCreate', async (interaction) => {
      if (interaction.isButton()) {
    console.log(`Botão ${interaction.customId} pressionado pelo usuário ${interaction.user.tag}`);
    if (!interaction.isButton()) {
      console.log(`A interação não é um botão.`);
      return;
    }

    const button = client.buttons.get(interaction.customId); // Obtém o botão a partir do id personalizado.

    if (!button) {
      console.log(`O botão ${interaction.customId} não existe.`);
      return;
    }

    if (button == undefined) {
      console.log(`O botão ${interaction.customId} é indefinido.`);
      return;
    }

    if (button.permission && !interaction.member.permissions.has(button.permission)) { // Verifica se o botão requer permissão e se o membro que interagiu possui essa permissão. Se não, responde com uma mensagem de erro.
      console.log(`O usuário ${interaction.user.tag} não tem permissão para usar o botão ${interaction.customId}.`);
      return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | You don't have the required permissions to use this.`).setColor("#f8312f") ], ephemeral: true });
    }

    if (button.developer && interaction.user.id !== "CHANGEME") { // Verifica se o botão é apenas para desenvolvedores e se o usuário que interagiu é um desenvolvedor. Se não, responde com uma mensagem de erro.
      console.log(`O botão ${interaction.customId} é apenas para desenvolvedores e o usuário ${interaction.user.tag} não é um desenvolvedor.`);
      return interaction.reply({ embeds: [ new EmbedBuilder().setDescription( `⛔ | This button is for developers only.`).setColor("#f8312f") ], ephemeral: true });
    }

    button.execute(interaction, client); // Executa a função correspondente ao botão.
  }
});