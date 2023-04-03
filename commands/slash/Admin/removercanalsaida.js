const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const { SetSaida } = require('./setsaida');

module.exports = {
  name: "remsetsaida",
  description: "[🧑‍💻 ADMIN] Remove o canal de saida",
  type: ApplicationCommandType.ChatInput,
  options: [
      { 
          name: "canal",
          description: "escolhe o canal que quer remover como canal de saida",
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
    const latestSetSaida = await SetSaida.findOne();

    if (!channel || channel.id !== latestSetSaida.channelId) {
        const embed2 = new EmbedBuilder()
          .setColor("BLUE")
          .setDescription(":x: Não foi possível remover o canal, certifique-se que menciona o canal que está definido como canal de saida.");
        return interaction.reply({ embeds: [embed2.toJSON()], ephemeral: true });
    }

    await SetSaida.deleteOne();
    const embed = new EmbedBuilder()
      .setColor("BLUE")
      .setDescription(":white_check_mark: O teu canal de saida foi removido.");
    return interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
  },
};
