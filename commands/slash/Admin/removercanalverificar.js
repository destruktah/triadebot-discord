const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const { SetVerificar } = require('./setverificar');

module.exports = {
  name: "remsetverificar",
  description: "[🧑‍💻 ADMIN] Remove o canal de verificação",
  type: ApplicationCommandType.ChatInput,
  options: [
      { 
          name: "canal",
          description: "escolhe o canal que quer remover como canal de verificação",
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
    const latestSetVerificar = await SetVerificar.findOne({ guildId: interaction.guildId });

    if (!channel || channel.id !== latestSetVerificar.channelId) {
        const embed2 = new EmbedBuilder()
          .setColor(0x000FF)
          .setDescription(":x: Não foi possível remover o canal, certifique-se que menciona o canal que está definido como canal de verificaçao.");
        return interaction.reply({ embeds: [embed2.toJSON()], ephemeral: true });
    }

    await SetVerificar.deleteOne({ guildId: interaction.guildId });
    const embed = new EmbedBuilder()
      .setColor(0x000FF)
      .setDescription(":white_check_mark: O teu canal de verificao foi removido.");
    return interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
  },
};