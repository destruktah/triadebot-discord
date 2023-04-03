const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');

const setSaidaSchema = new mongoose.Schema({
    channelId: {
      type: String,
      required: true
    }
  });
  
const SetSaida = mongoose.model('SetSaida', setSaidaSchema);

module.exports = {
  SetSaida,
  name: "setsaida",
  description: "[🧑‍💻 ADMIN] Seta o canal de saida",
  type: ApplicationCommandType.ChatInput,
  options: [
      { 
          name: "canal",
          description: "escolhe um canal para ser setado",
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

    const existingSetSaida = await SetSaida.findOne();
    if (existingSetSaida) {
      return interaction.reply({ content: 'Já há um canal de verificação definido. Para definires outro apaga a setagem primeiro', ephemeral: true });
    }
    const { options } = interaction;
    const channel = options.getChannel('canal');
    
    if (!channel) {
      console.error('Erro ao setar canal:', error);
      return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
    }
    
    const channelId = channel.id; 
    console.log(`ID do canal de saida: ${channelId}`);
  
    const setSaida = new SetSaida({ channelId });
    await setSaida.save();
  
    console.log('Canal de saida setado com sucesso');
    return interaction.reply({ content: 'Canal de boas saida setado com sucesso', ephemeral: true });
  },
};