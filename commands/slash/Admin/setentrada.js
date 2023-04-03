const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');

const setEntradaSchema = new mongoose.Schema({
    channelId: {
      type: String,
      required: true
    }
  });
  
const SetEntrada = mongoose.model('SetEntrada', setEntradaSchema);

module.exports = {
  SetEntrada,
  name: "setentrada",
  description: "[🧑‍💻 ADMIN] Seta o canal de entrada",
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
    const { options } = interaction;
    const channel = options.getChannel('canal');
    
    const existingSetEntrada = await SetEntrada.findOne();
    if (existingSetEntrada) {
      return interaction.reply({ content: 'Já há um canal de verificação definido. Para definires outro apaga a setagem primeiro', ephemeral: true });
    }

    if (!channel) {
      console.error('Erro ao setar canal:', error);
      return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
    }
    
    const channelId = channel.id; 
    console.log(`ID do canal de entrada: ${channelId}`);
  
    const setEntrada = new SetEntrada({ channelId });
    await setEntrada.save();
  
    console.log('Canal de boas vindas setado com sucesso');
    return interaction.reply({ content: 'Canal de boas vindas setado com sucesso', ephemeral: true });
  },
};