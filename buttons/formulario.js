const { EmbedBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, Events, ButtonStyle, ButtonBuilder} = require("discord.js");
const { SetFormulario } = require('../commands/slash/Admin/setformulario.js');
const mongoose = require('mongoose');
const client = require("../index.js");

const RespostasSchema = new mongoose.Schema({
  guildId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    passaporte: {
      type: String,
      required: true
    },
    celular: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
  });

  const respostas = mongoose.model('Respostas', RespostasSchema);

module.exports = {
  respostas,
  
    id: 'formulario',

    async execute(interaction) {
      
      const guildId = interaction.guild.id;
      const UserId = interaction.member.user.id;

      const latestRespostas = await respostas.findOne( {guildId: guildId, userId: UserId} )
      if (latestRespostas) {
        console.log(latestRespostas.userId);
        console.log('Já fazes parte da familia não te podes candidatar novamente');    
        return interaction.reply({ content: 'Já fazes parte da familia não te podes candidatar novamente', ephemeral: true });
      } else {  
      console.log('Formulário iniciado.');
        const latestSetFormulario = await SetFormulario.findOne();

        if (latestSetFormulario && latestSetFormulario.formChannelId) {
          console.log('canal de Formulário encontrado.');
            const guildId = latestSetFormulario.guildId
            const setFormularioformChannelId = latestSetFormulario.formChannelId;
            const setFormulariologChannelId = latestSetFormulario.logChannelId;
            const logChannel = interaction.guild.channels.cache.get(setFormulariologChannelId);
            if (!interaction.guild.channels.cache.get(setFormularioformChannelId))
            return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true });
            const modal = new ModalBuilder()
            .setCustomId("modal")
            .setTitle("Formulário de Recrutamento");
            console.log('Formulario criado');
            const pergunta1 = new TextInputBuilder()
            .setCustomId("pergunta1") // Coloque o ID da pergunta
            .setLabel("Nome In-game") // Coloque a pergunta
            .setMaxLength(30) // Máximo de caracteres para a resposta
            .setMinLength(5) // Mínimo de caracteres para a respósta
            .setPlaceholder("Escreva seu nome in-game aqui") // Mensagem que fica antes de escrever a resposta
            .setRequired(true) // Deixar para responder obrigatório (true | false)
            .setStyle(TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

            const pergunta2 = new TextInputBuilder()
            .setCustomId("pergunta2") // Coloque o ID da pergunta
            .setLabel("Passaporte") // Coloque a pergunta
            .setMaxLength(5) // Máximo de caracteres para a resposta
            .setPlaceholder("Escreva seu passaporte aqui") // Mensagem que fica antes de escrever a resposta
            .setStyle(TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
            .setRequired(true)

            const pergunta3 = new TextInputBuilder()
            .setCustomId("pergunta3") // Coloque o ID da pergunta
            .setLabel("Celular") // Coloque a pergunta
            .setPlaceholder("Escreva seu número celular in-game aqui") // Mensagem que fica antes de escrever a resposta
            .setMaxLength(7)
            .setStyle(TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
            .setRequired(true)

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

            try { client.on(Events.InteractionCreate, async interaction => {
              if (!interaction.isModalSubmit()) return;
              else {
              console.log('aguarda o evento de interação');
              if (interaction.customId === "modal");

                let nome = interaction.fields.getTextInputValue("pergunta1");
                let passaporte = interaction.fields.getTextInputValue("pergunta2");
                let celular = interaction.fields.getTextInputValue("pergunta3");
        
                if (!nome) nome = "Não informado.";
                if (!passaporte) passaporte = "Não informado.";
                if (!celular) celular = "Não informado.";
        
                let embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`O usuário ${interaction.user} enviou o formulário abaixo:`)
                .addFields(
                  {
                    name: `Nome In-game:`,
                    value: `\`${nome}\``,
                    inline: false
                  },
                  {
                    name: `Passaporte:`,
                    value: `\`${passaporte}\``,
                    inline: false
                  },
                  {
                    name: `Celular:`,
                    value: `\`${celular}\``,
                    inline: false
                  }
                );
                 
                const userId = interaction.member.user.id;
                console.log(`formulario submetido por: ${userId}`); 
                const existingrespostas = await respostas.findOne({ guildId: guildId, userId: userId });
                  if (existingrespostas) {
                    return interaction.reply({ content: 'Já submeteste a tua candidatura, agora pela resposta', ephemeral: true });
                  }
                
                const acceptButton = new ButtonBuilder()
                .setCustomId(`aceitar-${interaction.user.id}`)
                .setLabel('Aceitar')
                .setStyle(ButtonStyle.Success);

                const rejectButton = new ButtonBuilder()
                .setCustomId(`rejeitar-${interaction.user.id}`)
                .setLabel('Recusar')
                .setStyle(ButtonStyle.Danger);

                const actionRow = new ActionRowBuilder()
                .addComponents(acceptButton, rejectButton);

                const logMessageOptions = {
                embeds: [embed],
                components: [actionRow]
                };
                const message = await logChannel.send(logMessageOptions);
                const messageId = message.id;
                const newnresposta = new respostas({ guildId: guildId, userId: userId, nome: nome, passaporte: passaporte, celular: celular, message: messageId });
                await newnresposta.save();
                
              }
              await interaction.reply({ content: `Olá **${interaction.user.username}**, seu formulário foi enviado com sucesso!`, ephemeral: true});
            }  
          )}
         catch (error) {
          console.error(error);}
}}}}