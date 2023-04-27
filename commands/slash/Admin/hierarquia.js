const { PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, roleMention } = require('discord.js');
const mongoose = require('mongoose');

const HierarquiaSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  },
  LideresRoleId: {
    type: [String],
    required: true
  },
  GerentesRoleId: {
    type: [String],
    required: true
  },
  TacticosRoleId: {
    type: [String],
    required: true
  },
  MembrosRoleId: {
    type: [String],
    required: true
  },
});

const Hierarquia = mongoose.model('Hierarquia', HierarquiaSchema);

module.exports = {
  Hierarquia,
  name: "hierarquia",
  description: "[🧑‍💻 ADMIN] Seta as roles para a hierarquia e o canal onde e enviada a mensagem com a hierarquia",
  type: ApplicationCommandType.ChatInput,
  options: [
    { 
      name: "canal",
      description: "escolhe um canal para ser setado e enviar mensagem",
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
        name: "lideres_roles",
        description: "escolhe as roles pertencentes aos lideres",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "gerentes_roles",
        description: "escolhe as roles pertencentes aos gerentes",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "tacticos_roles",
        description: "escolhe as roles pertencentes aos tacticos",
        type: ApplicationCommandOptionType.String,
        require: true
    },
    {
        name: "membros_roles",
        description: "escolhe as roles pertencentes aos membros",
        type: ApplicationCommandOptionType.String,
        require: true
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
    const guildId = interaction.guildId;

    const existingHierarquia = await Hierarquia.findOne({ guildId: guildId });
    if (existingHierarquia) {
      return interaction.reply({ content: 'Já existe uma hierarquia definida. Para definires outra apaga a setagem primeiro', ephemeral: true });
    }

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
    
      return await interaction.reply({ content: "❌ Não foi possível encontrar o servidor.", ephemeral: true });
}
    const channel = options.getChannel('canal');
    const ChannelId = channel.id;
    const lideresRoles = options.getString("lideres_roles");
    console.log("lideresRoles:", lideresRoles);
    const gerentesRoles = options.getString("gerentes_roles");
    console.log("gerentesRoles:", gerentesRoles);
    const tacticosRoles = options.getString("tacticos_roles");
    console.log("tacticosRoles:", tacticosRoles);
    const membrosRoles = options.getString("membros_roles");
    console.log("membrosRoles:", membrosRoles);

    const hierarchyRoles = {
      lideres: lideresRoles.split(" ").map(role => role.slice(3, -1)),
      gerentes: gerentesRoles.split(" ").map(role => role.slice(3, -1)),
      tacticos: tacticosRoles.split(" ").map(role => role.slice(3, -1)),
      membros: membrosRoles.split(" ").map(role => role.slice(3, -1))
    };
    
    console.log("hierarchyRoles:", hierarchyRoles);
    
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Hierarquia");
    
    // Buscar todos os membros do servidor
    await guild.members.fetch();
    
    // Objeto para armazenar os membros já mencionados
    const membersMentioned = {};
    
    for (const [roleName, roleIds] of Object.entries(hierarchyRoles)) {
      const members = [];
      for (const roleId of roleIds) {
        const role = guild.roles.cache.get(roleId);
        if (!role) continue;
        Array.from(guild.members.cache.values()).forEach(member => {
          // Verifica se o membro tem o cargo específico
          if (member.roles.cache.has(roleId)) {
            const memberId = member.user.id;
            // Verifica se o membro já foi mencionado em um cargo mais alto
            if (!membersMentioned[memberId]) {
              members.push(member.toString());
              membersMentioned[memberId] = true;
            }
          }
        });
      }
      embed.addFields({ name: roleName, value: members.join(", ") || "Nenhum" });
    }
    
    embed.setTimestamp();
    
    await channel.send({ embeds: [embed] });
    
    
      const setHierarquia = new Hierarquia({ 
        guildId: guildId, 
        channelId: ChannelId, 
        LideresRoleId: lideresRoles.split(" ").map(role => role.slice(3, -1)),
        GerentesRoleId: gerentesRoles.split(" ").map(role => role.slice(3, -1)),
        TacticosRoleId: tacticosRoles.split(" ").map(role => role.slice(3, -1)),
        MembrosRoleId: membrosRoles.split(" ").map(role => role.slice(3, -1))
       });

         await setHierarquia.save();
         return interaction.reply({ content: 'Hierarquia setada com sucesso', ephemeral: true });
     }               
        }