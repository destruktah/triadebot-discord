const { EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, ModalSubmitInteraction} = require("discord.js");
const { SetFormulario } = require('../commands/slash/Admin/setformulario.js');

module.exports = {
  
    id: 'formulario',

    async execute(interaction) {
      console.log('Formulário iniciado.');
        const latestSetFormulario = await SetFormulario.findOne();
        if (latestSetFormulario && latestSetFormulario.formChannelId) {
          console.log('canal de Formulário encontrado.');
            const setFormularioformChannelId = latestSetFormulario.formChannelId;
            const setFormulariologChannelId = latestSetFormulario.logChannelId;
            if (!interaction.guild.channels.cache.get(setFormularioformChannelId))
            return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true });
            const modal = new ModalBuilder()
            .setCustomId("modal")
            .setTitle("Formulário de Recrutamento");
            console.log('Formulario criado');
            const pergunta1 = new TextInputBuilder()
            .setCustomId("pergunta1") // Coloque o ID da pergunta
            .setLabel("Pergunta 1??") // Coloque a pergunta
            .setMaxLength(30) // Máximo de caracteres para a resposta
            .setMinLength(5) // Mínimo de caracteres para a respósta
            .setPlaceholder("Escreva sua Resposta 1 aqui!") // Mensagem que fica antes de escrever a resposta
            .setRequired(true) // Deixar para responder obrigatório (true | false)
            .setStyle(TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

            const pergunta2 = new TextInputBuilder()
            .setCustomId("pergunta2") // Coloque o ID da pergunta
            .setLabel("Pergunta 2??") // Coloque a pergunta
            .setMaxLength(30) // Máximo de caracteres para a resposta
            .setPlaceholder("Escreva sua Resposta 2 aqui!") // Mensagem que fica antes de escrever a resposta
            .setStyle(TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
            .setRequired(false)

            const pergunta3 = new TextInputBuilder()
            .setCustomId("pergunta3") // Coloque o ID da pergunta
            .setLabel("Pergunta 3??") // Coloque a pergunta
            .setPlaceholder("Escreva sua Resposta 3 aqui!") // Mensagem que fica antes de escrever a resposta
            .setStyle(TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
            .setRequired(false)
            console.log('Perguntas criadas');
            modal.addComponents(
            new ActionRowBuilder().addComponents(pergunta1),
            new ActionRowBuilder().addComponents(pergunta2),
            new ActionRowBuilder().addComponents(pergunta3)
            )
            console.log('Formulario criado com sucesso');
            console.log('tenta mostrar o formulario');
            await interaction.showModal(modal);
            console.log('mostrou formulario');
            try { 
              console.log('aguarda o evento de interação');
              // Aguarda o evento de interação com o formulário
              const formInteraction = await interaction.isModalSubmit();
              console.log('Recebeu interação com o formulário');
        
              // Verifica se a interação é do formulário correto
              if (formInteraction.customId !== modal.customId) {
                console.log('Interação inválida');
                return;
              }
        
              if (formInteraction.customId === "modal") { 
                let resposta1 = formInteraction.fields.getTextInputValue("pergunta1");
                let resposta2 = formInteraction.fields.getTextInputValue("pergunta2");
                let resposta3 = formInteraction.fields.getTextInputValue("pergunta3");
        
                if (!resposta1) resposta1 = "Não informado.";
                if (!resposta2) resposta2 = "Não informado.";
                if (!resposta3) resposta3 = "Não informado.";
        
                let embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: formInteraction.guild.name, iconURL: formInteraction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(formInteraction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`O usuário ${formInteraction.user} enviou o formulário abaixo:`)
                .addFields(
                  {
                    name: `Pergunta 1:`,
                    value: `*Resposta 1:* \`${resposta1}\``,
                    inline: false
                  },
                  {
                    name: `Pergunta 2:`,
                    value: `*Resposta 2:* \`${resposta2}\``,
                    inline: false
                  },
                  {
                    name: `Pergunta 3:`,
                    value: `*Resposta 3:* \`${resposta3}\``,
                    inline: false
                  }
                );
                  
                await formInteraction.reply({ content: `Olá **${formInteraction.user.username}**, seu formulário foi enviado com sucesso!`, ephemeral: true});
                const logChannel = formInteraction.guild.channels.cache.get(setFormulariologChannelId);
                await logChannel.send({ embeds: [embed] });
              }
            } catch (e) { 
              console.error(e);
              return; 
            }
          }
        }
};