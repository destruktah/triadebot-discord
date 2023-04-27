const { PermissionsBitField, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const mongoose = require('mongoose');

const setFormularioSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
      },
      formChannelId: {
        type: String,
        required: true
      },
      logChannelId: {
        type: String,
        required: true
      },
      resultChannelId: {
        type: String,
        required: true
      },
      recrutadoRole: {
        type: String,
        required: true
      },
      recrutadoId: {
        type: String,
        required: false
      },
      novorecrutChannelId: {
        type: String,
        required: false,
      },
      InfoMemberChannelId: {
        type: String,
        required: false,
      }
    });

  const SetFormulario = mongoose.model('SetFormulário', setFormularioSchema);

  module.exports = {
    SetFormulario,
    name: "setformulario",
    description: "[🧑‍💻 ADMIN] Seta o canal onde o utilizador vai preencher o formulário",
    type: ApplicationCommandType.ChatInput,
    options: [
      { 
        name: "canal_formulario",
        description: "Escolhe um canal para ser setado",
        type: ApplicationCommandOptionType.Channel,
        required: true
      },
      {
        name: "canal_logs",
        description: "Canal para enviar as logs dos formulários para aprovação",
        type: ApplicationCommandOptionType.Channel,
        required: true
      },
      {
        name: "canal_resultados",
        description: "Escolhe um canal para ser setado como o canal para enviar as mensagens de aprovação ou reprovação",
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
      {
        name: "cargo",
        description: "Menciona o cargo que irá receber os usuários recrutados",
        type: ApplicationCommandOptionType.Role,
        required: true
      },
      {
        name: "canal_novorecrut",
        description: "Canal para enviar mensagem de boas vindas ao novo membro",
        type: ApplicationCommandOptionType.Channel,
        required: false
      },
      {
        name: "canal_infomembros",
        description: "Canal para onde enviada as infos dos utilizadores com formulario aceite",
        type: ApplicationCommandOptionType.Channel,
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
        const formChannel = options.getChannel('canal_formulario');
        const logChannel = options.getChannel('canal_logs');
        const resultChannel = options.getChannel('canal_resultados');
        const novorecrutChannel = options.getChannel('canal_novorecrut');
        const InfoMemberChannel = options.getChannel('canal_infomembros');
        const role = options.getRole('cargo');

        if (!formChannel || !logChannel || !resultChannel) {
            console.error('Erro ao setar canais');
            return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
        }

            const guildId = interaction.guildId;
            const formChannelId = formChannel.id;
            const logChannelId = logChannel.id;
            const resultChannelId = resultChannel.id;
            const roleId = role.id;
            const novorecrutChannelId = novorecrutChannel.id;
            const InfoMemberChannelId = InfoMemberChannel.id;
          
            console.log(`ID do canal de formulário: ${formChannelId}`);
            console.log(`ID do canal de registro das respostas dos usuários: ${logChannelId}`);
            console.log(`ID do canal para enviar as mensagens de aprovação ou reprovação: ${resultChannelId}`);

            const setformulario = new SetFormulario({ 
              guildId: guildId, 
              formChannelId: formChannelId, 
              logChannelId: logChannelId, 
              resultChannelId: resultChannelId, 
              recrutadoRole: roleId, 
              novorecrutChannelId: novorecrutChannelId,
              InfoMemberChannelId:InfoMemberChannelId });
            await setformulario.save();

        const formEmbed = new EmbedBuilder()
        .setTitle("Formulário")
        .setDescription('Preenche o formulário de recrutamento abaixo')
        .setColor(0x5fb041);

        const formButton = new ButtonBuilder()
        .setCustomId("formulario")
        .setEmoji("☝")
        .setLabel("Clique Aqui!")
        .setStyle(ButtonStyle.Primary)

        if (formChannel) {
            formChannel.send({
                embeds: [formEmbed],
                    components: [
                        new ActionRowBuilder().addComponents(formButton),
                    ],
             });
            console.log('Mensagem enviada para o canal de formulário');
            return interaction.reply({ content: 'Canal de formulário setado com sucesso', ephemeral: true });
            } else {
            console.error('Canal de formulário não encontrado');
            return interaction.reply({ content: 'Ocorreu um erro! Tenta novamente mais tarde.', ephemeral: true });
            }
        }
    }