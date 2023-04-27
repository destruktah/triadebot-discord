const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SetFormulario } = require('../commands/slash/Admin/setformulario');
const { respostas } = require('./formulario.js');
const path = require('path');


module.exports = {

    id: 'aceitar',

    async execute(interaction) {
        
        const guildId = interaction.guildId;
        const formulario = await SetFormulario.findOne({ guildId: guildId });
        const Canvas = require('canvas');
        const userId = formulario.recrutadoId;
        const roleId = formulario.recrutadoRole;
        const novorecrutChannel = interaction.client.channels.cache.get(formulario.novorecrutChannelId);
        const resultChannel = interaction.client.channels.cache.get(formulario.resultChannelId);
        const logchannelId = interaction.client.channels.cache.get(formulario.logChannelId);

        const latestrespostas = await respostas.findOne({ guildId: guildId, userId: userId});
        await SetFormulario.updateOne({ guildId: guildId }, { $unset: { recrutadoId: '' } });
        
        if ( latestrespostas && latestrespostas.userId && latestrespostas.nome && latestrespostas.passaporte && latestrespostas.celular && latestrespostas.message ) {

            const message = latestrespostas.message;
            const messageId = await logchannelId.messages.fetch(message);

            const memberId = latestrespostas.userId;
            const nome = latestrespostas.nome;
            const passaporte = latestrespostas.passaporte;
            const celular = latestrespostas.celular;

            const guild = interaction.guild;
            const member = await guild.members.fetch(memberId);
            const userid = interaction.user.id;
            const user = await guild.members.fetch(userid);

            try {
                
                await member.setNickname(`${nome} | ${passaporte}`);
                await member.roles.add(roleId);
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(path.join(__dirname,'../triad.png.'));
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.font = '36px sans';
                ctx.fillStyle = '#000000';
                const texto =`Bem vindo ${member.user.username} a familia da Triade!`;
                const textoWidth = ctx.measureText(texto).width;
                ctx.fillText(texto, canvas.width / 2 - textoWidth / 2, canvas.height / 5); 
                const attachment = new AttachmentBuilder(canvas.toBuffer(), {name: 'welcome-image.png'});
                const aprovadoMessage = `Parabéns <@${member.id}> a tua candidatura foi aceite!`
                const aprovadoEmbed = new EmbedBuilder()
                .setTitle("Candidatura aceite")
                .setDescription(aprovadoMessage)
                .setColor(0x037821)
                .setTimestamp();
                resultChannel.send({embeds: [aprovadoEmbed]});
                novorecrutChannel.send({files: [attachment]});
                await respostas.updateOne({ guildId: guildId }, { $unset: { message: '' } });
                await messageId.delete();

                console.log(`Nome do usuário ${member.user.username} atualizado para ${nome}`);
                console.log(`Role do usuário ${member.user.username} atualizado para ${roleId}`);

                const informacoes = await respostas.find({ guildId: guildId }).lean();

                // Inicialize um array vazio para armazenar as informações de cada usuário
                let usuarios = [];

                // Percorra a lista de documentos e extraia as informações relevantes
                informacoes.forEach((usuario) => {
                    // Crie uma string com as informações desejadas e adicione ao array de usuários
                    usuarios.push(`Nome: ${usuario.nome} Passaporte: ${usuario.passaporte} Celular: ${usuario.celular}`);
                });

                // Construa a embed usando os dados coletados
                const embed = new EmbedBuilder()
                .setTitle("Informações dos Membros")
                .setDescription(usuarios.join("\n"))
                .setColor("#037821")
                .setTimestamp();
                
                // Envie a embed para o canal desejado
                const InfoMemberChannelId = interaction.client.channels.cache.get(formulario.InfoMemberChannelId);
                
                InfoMemberChannelId.send({ embeds: [embed] });
                
                interaction.reply({ content: `<@${user.id}> aceitou a candidatura do membro <@${member.id}>`});

              } catch (error) {
                console.error(`Não foi possível atualizar o nome do usuário ${member.user.username}: ${error}`);
                console.error(`Não foi possível atualizar o role do usuário ${member.user.username}: ${error}`);
            }
        }
    }
}    