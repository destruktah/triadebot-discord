const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const { SetFormulario } = require('./setformulario');

module.exports = {
  name: "remformulario",
  description: "[🧑‍💻 ADMIN] Remove o formulário de inscrição",
  type: ApplicationCommandType.ChatInput,
  options: [
      { 
          name: "canal",
          description: "escolhe o canal que quer remover como formulário de inscrição",
          type: ApplicationCommandOptionType.Channel,
          required: true
      }
  ],
  permissions: {
      DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  
  run: async (client, interaction, config, db) => {
    if (!interaction.member || !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({ content: "🚫 Tens que ser Administrador para executar este comando", ephemeral: true});
    }  
  
    const { options } = interaction;
    const channel = options.getChannel('canal');
    const latestSetFormulario = await SetFormulario.findOne({ guildId: interaction.guildId }); // Recupera o SetFormulario correspondente ao servidor atual

    if (!latestSetFormulario || channel.id !== latestSetFormulario.formChannelId) {
      const embed2 = new EmbedBuilder()
      .setColor('DarkRed')
      .setDescription(":x: Não foi possível remover o formulário, certifique-se que menciona o canal que está definido como formulário de inscrição.");
    return interaction.reply({ embeds: [embed2.toJSON()], ephemeral: true });
    }

    await SetFormulario.deleteOne({ guildId: interaction.guildId }); // Remove o SetFormulario correspondente ao servidor atual
    const embed = new EmbedBuilder()
    .setColor('DarkGreen')
    .setDescription(":white_check_mark: O teu formulário de inscrição foi removido.");
  return interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
  },  
};