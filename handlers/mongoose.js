// Importa as bibliotecas necessárias
const mongoose = require('mongoose');
const config = require("../config/config.js");
const colors = require("colors");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Importa alguns comandos personalizados
const { SetEntrada } = require('../commands/slash/Admin/setentrada.js');
const { SetSaida } = require("../commands/slash/Admin/setsaida.js");
const { SetVerificar } = require('../commands/slash/Admin/setverificar.js');

// Configura as variáveis de ambiente
require('dotenv').config();

// Exporta a função que será usada pelo bot
module.exports = (client) => {
	// Conecta-se ao MongoDB
	console.log("\n" + "[DATABASE🍃] Começou a se conectar ao MongoDB...".brightYellow);
	const mongo = process.env.MONGODB || config.Handlers.MongoDB;

	if (!mongo) {
		console.log("[AVISO😨] Mongo URI/URL não foi fornecido! (Não obrigatório)".red);
	} else {
		mongoose.set('strictQuery', false);
		mongoose.connect(mongo, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).catch((e) => console.log(e))

		// Quando a conexão é estabelecida, realiza algumas verificações
		mongoose.connection.once("open", async () => {
			console.log("[DATABASE🍃] Conectado ao MongoDB com sucesso!".brightGreen);

			// Verifica o último canal definido para o comando "SetEntrada"
			try {
				const latestSetEntrada = await SetEntrada.findOne();
				if (latestSetEntrada && latestSetEntrada.channelId) {
					const setEntradaChannelId = latestSetEntrada.channelId;
					console.log(`SetEntrada channel ID: ${setEntradaChannelId}`);
				} else {
					console.error('Cana de entrada não setado');
				}
			} catch (err) {
				console.error('Erro ao recuperar ID do canal SetEntrada do banco de dados', err);
			}

			// Verifica o último canal definido para o comando "SetSaida"
			try {
				const latestSetSaida = await SetSaida.findOne();
				if (latestSetSaida && latestSetSaida.channelId) {
					const setSaidaChannelId = latestSetSaida.channelId;
					console.log(`SetSaida channel ID: ${setSaidaChannelId}`);
				} else {
					console.error('Canal de saída não está setado.');
				}
			} catch (err) {
				console.error('Erro ao recuperar o ID do canal SetSaida do banco de dados', err);
			}

			try {
				// Procura na base de dados a última entrada de "SetVerificar"
				const latestSetVerificar = await SetVerificar.findOne();
			
				// Verifica se a última entrada existe e se contém informações necessárias (guildId, channelId e roleId)
				if (latestSetVerificar && latestSetVerificar.guildId && latestSetVerificar.channelId && latestSetVerificar.roleId) {
					// Extrai as informações necessárias da última entrada de "SetVerificar"
					const setVerificarGuildId = latestSetVerificar.guildId;
					const setVerificarChannelId = latestSetVerificar.channelId;
					const setVerificarRoleId = latestSetVerificar.roleId;
					
					// Imprime no console as informações extraídas
					console.log(`SetVerificar Guild ID: ${setVerificarGuildId}`)
					console.log(`SetVerificar channel ID: ${setVerificarChannelId}`);
					console.log(`SetVerificar role ID: ${setVerificarRoleId}`);
			
					// Procura o objeto "guild" (servidor) correspondente a "setVerificarGuildId"
					const guild = client.guilds.cache.get(setVerificarGuildId);
			
					// Verifica se "guild" existe
					if (guild) {
						// Procura o objeto "role" (papel) correspondente a "setVerificarRoleId" dentro do servidor "guild"
						const role = guild.roles.cache.get(setVerificarRoleId);
			
						// Verifica se "role" existe
						if (!role) {
							console.error(`SetVerificar role ID "${setVerificarRoleId}" não encontrado nas roles do servidor`);
							return;
						}
					} else {
						console.error(`SetVerificar guild ID "${setVerificarGuildId}" não encontrado na base de dados do bot`);
						return;
					}
			
					// Procura o objeto "channel" (canal de texto) correspondente a "setVerificarChannelId"
					const channel = client.channels.cache.get(setVerificarChannelId);
			
					// Procura o objeto "role" (papel) correspondente a "setVerificarRoleId" dentro do servidor "guild"
					const role = guild.roles.cache.get(setVerificarRoleId);
			
					// Verifica se "channel" existe
					if (!channel) {
						console.error(`SetVerificar channel ID "${setVerificarChannelId}" não encontrado nos canais do servidor`);
						return;
					}
			
					// Verifica se "role" existe
					if (!role) {
						console.error(`SetVerificar role ID "${setVerificarRoleId}" não encontrado nas roles do servidor`);
						return;
					}
			
					// Apaga todas as mensagens do canal "channel" que foram enviadas pelo bot
					await channel.messages.fetch().then(messages => {
						messages.forEach(msg => {
							if (msg.author.id === client.user.id) {
								msg.delete().catch(console.error);
							}
						});
					});

				  await SetVerificar.findOneAndUpdate({}, { channel, role });
			  
				  // Envia a nova mensagem com o botão de verificação
				  const verifyEmbed = new EmbedBuilder()
					.setTitle("Verificação")
					.setDescription('Clica no botão abaixo para verificar a tua conta e conseguires acesso ao servidor')
					.setColor(0x5fb041);
			  
				  const sendChannel = await channel.send({
					embeds: [verifyEmbed],
					components: [
					  new ActionRowBuilder().setComponents(
						new ButtonBuilder().setCustomId('verificar').setLabel('Verificar').setStyle(ButtonStyle.Success),
					  ),
					],
				  });
				} else {
				  console.error('Não existe canal de verificação setado,');
				}
			} catch (err) {
				console.error('Erro ao recuperar o ID do canal de verificação e o ID da role do banco de dados', err);
			  }
			  
		})
	}
}