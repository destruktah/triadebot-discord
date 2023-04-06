const { EmbedBuilder } = require("discord.js");
const { SetVerificar } = require('../commands/slash/Admin/setverificar.js');

module.exports = {
  
  id: 'verificar',

  async execute(interaction) {

    const latestSetVerificar = await SetVerificar.findOne();
			
				// Verifica se a última entrada existe e se contém informações necessárias (roleId)
				if (latestSetVerificar && latestSetVerificar.roleId) {
					// Extrai as informações necessárias da última entrada de "SetVerificar"
					const setVerificarRoleId = latestSetVerificar.roleId;

    await interaction.deferUpdate();
    
    const member = interaction.member;
    // Verifica se o usuário já tem a role necessária
    if (member.roles.cache.has(setVerificarRoleId)) {
      // Se o usuário já tiver a role, envia uma mensagem dizendo que ele já foi verificado
      const alreadyVerifiedEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setDescription("Você já foi verificado!");
      await interaction.followUp({ embeds: [alreadyVerifiedEmbed], ephemeral: true });
    } else {
      try {
        // Se o usuário não tiver a role, adiciona a role e envia uma mensagem de boas-vindas
        await member.roles.add(setVerificarRoleId);

        const membersWithRoles = (await interaction.guild.members.fetch()).filter(member => !member.user.bot && member.roles.cache.size > 1).size;
        const welcomeMessage = `Parabéns <@${member.id}> foste verificado com sucesso!\n agora tens acesso ao servidor!`;

        const welcomeEmbed = new EmbedBuilder()
          .setTitle("Novo utilizador verificado!")
          .setDescription(welcomeMessage)
          .setColor(0x037821)
          .addFields({ name: `Utilizadores verificados no Servidor`, value: `${membersWithRoles}` })
          .setTimestamp();

        await interaction.followUp({ embeds: [welcomeEmbed], ephemeral: true });

      } catch (error) {
        console.error(error);

        const errorMessageEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setDescription(`Ocorreu um erro ao verificar a sua conta. Tente novamente mais tarde.`);

        await interaction.followUp({ embeds: [errorMessageEmbed], ephemeral: true });
      }
    }
  }
}};