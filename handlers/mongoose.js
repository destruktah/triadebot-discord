const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);

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
	} catch (err) {
		console.error(`[DATABASE🍃] Erro ao conectar ao MongoDB: ${err}`.brightRed);
	  }
    };