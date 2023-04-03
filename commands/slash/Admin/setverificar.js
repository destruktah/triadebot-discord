const { EmbedBuilder, PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');
const mongoose = require('mongoose');

const setVerificarSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  },
  roleId: {
    type: String,
    required: true
  }
});

const SetVerificar = mongoose.model('SetVerificar', setVerificarSchema);

module.exports = {
  SetVerificar,
  
  name: "setverificar",
  description: "[🧑‍💻 ADMIN] Seta o canal de verificação",
  type: ApplicationCommandType.ChatInput,
  options: [
    { 
      name: "canal",
      description: "Escolhe um canal para ser setado",
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: "cargo",
      description: "Menciona o cargo que irá receber os usuários verificados",
      type: ApplicationCommandOptionType.Role,
      required: true
    }
  ],
  defaultPermission: false,
  permissions: [
    {
      id: "seu_role_id",
      type: "ROLE",
      permission: true
    }
  ],

  run: async (client, interaction, config, db) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({ content: "🚫 Tens que ser Administrador para executar este comando", ephemeral: true});
    }
  
    const { options } = interaction;
    const channel = options.getChannel('canal');
    const role = options.getRole('cargo');
  
    if (!channel || !role) {
      console.error('Erro ao setar canal e cargo:', error);
      return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
    }
    
    const guildId = interaction.guildId;
    const channelId = channel.id;
    const roleId = role.id;

    console.log(`ID do servidor: ${guildId}`);
    console.log(`ID do canal de verificação: ${channelId}`);
    console.log(`ID do cargo de usuários verificados: ${roleId}`);
  
    await SetVerificar.findOneAndUpdate({}, { guildId, channelId, roleId }, { upsert: true });
  
    const verifyEmbed = new EmbedBuilder()
      .setTitle("Verificação")
      .setDescription('Clica no botão abaixo para verificar a tua conta e conseguires acesso ao servidor')
      .setColor(0x5fb041);
  
    const verifyButton = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('Verificar')
      .setStyle(ButtonStyle.Success);

      const sendChannel = await channel.send({
        embeds: [verifyEmbed],
        components: [
          new ActionRowBuilder().addComponents(verifyButton),
        ],
      });
      console.log('Mensagem enviada para o canal:');
      console.log(sendChannel);
      verifyButton,
      sendChannel;
  }
};