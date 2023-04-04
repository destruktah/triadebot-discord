const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SetEntrada } = require('../commands/slash/Admin/setentrada.js');
const { SetSaida } = require("../commands/slash/Admin/setsaida.js");
const { SetVerificar } = require('../commands/slash/Admin/setverificar.js');


module.exports = async (client) => {
  // Conecta-se ao MongoDB
  console.log("\n" + "[DATABASE🍃] Começou a se conectar ao MongoDB...".brightYellow);
  const mongo = process.env.MONGODB;
  if (!mongo) console.log("[AVISO😨] Mongo URI/URL não foi fornecido! (Não obrigatório)".red);
  try {
    await mongoose.connect(mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[DATABASE🍃] Conectado ao MongoDB com sucesso!".brightGreen);

    // Executa várias operações em paralelo, aguardando todos os resultados com Promise.all()
    const [setEntrada, setSaida, setVerificar] = await Promise.all([
      SetEntrada.findOne(),
      SetSaida.findOne(),
      SetVerificar.findOne(),
    ]);

    // Verifica a última entrada de "SetEntrada" e "SetSaida"
    if (setEntrada && setEntrada.channelId) console.log(`SetEntrada channel ID: ${setEntrada.channelId}`);
    else console.error('Canal de entrada não setado');
    if (setSaida && setSaida.channelId) console.log(`SetSaida channel ID: ${setSaida.channelId}`);
    else console.error('Canal de saída não está setado.');

    // Verifica a última entrada de "SetVerificar"
    if (setVerificar?.guildId && setVerificar?.channelId && setVerificar?.roleId) {
      const { guildId, channelId, roleId } = setVerificar;
      console.log(`SetVerificar Guild ID: ${guildId}`);
      console.log(`SetVerificar channel ID: ${channelId}`);
      console.log(`SetVerificar role ID: ${roleId}`);

      // Procura o objeto "guild" (servidor) correspondente a "setVerificarGuildId"
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        console.error(`SetVerificar guild ID "${guildId}" não encontrado na base de dados do bot`);
        return;
      }

      // Procura o canal "verificar" correspondente a "setVerificarChannelId"
      const channel = guild.channels.cache.get(channelId);
      if (!channel) {
        console.error(`SetVerificar channel ID "${channelId}" não encontrado na base de dados do bot`);
        return;
      }

      // Procura a role "verificar" correspondente a "setVerificarRoleId"
      const role = guild.roles.cache.get(roleId);
      if (!role) {
        console.error(`SetVerificar role ID "${roleId}" não encontrado na base de dados do bot`);
        return;
      }
	} else {
		console.error('SetVerificar não configurado corretamente');
		}	
	} catch (err) {
		console.error(`[DATABASE🍃] Erro ao conectar ao MongoDB: ${err}`.brightRed);
	  }
    };