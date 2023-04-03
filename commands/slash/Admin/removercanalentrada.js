const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const { SetEntrada } = require('./setentrada');

module.exports = {
  name: "remsetentrada",
  description: "[🧑‍💻 ADMIN] Remove o canal de entrada",
  type: ApplicationCommandType.ChatInput,
  options: [
      { 
          name: "canal",
          description: "escolhe o canal que quer remover como canal de entrada",
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
    const latestSetEntrada = await SetEntrada.findOne();

    if (!channel || channel.id !== latestSetEntrada.channelId) {
        const embed2 = new EmbedBuilder()
          .setColor("BLUE")
          .setDescription(":x: Não foi possível remover o canal, certifique-se que menciona o canal que está definido como canal de entrada.");
        return interaction.reply({ embeds: [embed2.toJSON()], ephemeral: true });
    }

    await SetEntrada.deleteOne();
    const embed = new EmbedBuilder()
      .setColor("BLUE")
      .setDescription(":white_check_mark: O teu canal de entrada foi removido.");
    return interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
  },
};
