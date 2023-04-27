const { EmbedBuilder} = require("discord.js");
const { SetFormulario } = require('../commands/slash/Admin/setformulario');
const { respostas } = require('./formulario.js');

module.exports = {

    id: 'rejeitar',

    async execute(interaction, client) {
        const guildId = interaction.guildId;
        const formulario = await SetFormulario.findOne({ guildId: guildId });
        const userId = formulario.recrutadoId;
        const resultchannelId = client.channels.cache.get(formulario.resultChannelId);
        const logchannelId = client.channels.cache.get(formulario.logChannelId);
        const latestrespostas = await respostas.findOne({ guildId: guildId, userId: userId});
        if ( latestrespostas && latestrespostas.userId && latestrespostas.message) {
            const message = latestrespostas.message;
            const messageId = await logchannelId.messages.fetch(message);
            const guild = interaction.guild;
            const member = await guild.members.fetch(userId);
            try {
                const reprovadoMessage = `${member.toString()} infelizmente a tua candidatura não foi aceite!`
                const reprovadoEmbed = new EmbedBuilder()
                .setTitle("Candidatura reprovada")
                .setDescription(reprovadoMessage)
                .setColor(0x037821)
                .setTimestamp();
                
                resultchannelId.send({embeds: [reprovadoEmbed]});

                await latestrespostas.deleteOne({ guildId: guildId, userId: userId });

                await messageId.delete();  

            } catch (error) {
            console.error(`Não foi possível rejeitar a candidatura do ${member.user.username}`);
          }
           
        }
    }
}