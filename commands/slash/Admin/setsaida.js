const { PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');

const setSaidaSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  }
});

const SetSaida = mongoose.model('SetSaida', setSaidaSchema);

module.exports = {
  SetSaida,
  name: "setsaida",
  description: "[🧑‍💻 ADMIN] Seta o canal de entrada",
  type: ApplicationCommandType.ChatInput,
  options: [
    { 
      name: "canal",
      description: "escolhe o canal para remover o set",
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
    const guildId = interaction.guildId;
    
    const existingSetSaida = await SetSaida.findOne({ guildId: guildId });
    if (existingSetSaida) {
      return interaction.reply({ content: 'Já há um canal de saida definido. Para definires outro apaga a setagem primeiro', ephemeral: true });
    }

    if (!channel) {
      console.error('Erro ao setar canal:', error);
      return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
    }
    
    const channelId = channel.id; 
    console.log(`ID do canal de saida: ${channelId}`);
  
    const setSaida = new SetSaida({ guildId: guildId, channelId: channelId });
    await setSaida.save();
  
    console.log('Canal de saida setado com sucesso');
    return interaction.reply({ content: 'Canal de saida setado com sucesso', ephemeral: true });
  },
};