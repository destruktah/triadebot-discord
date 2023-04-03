// Importa o módulo de manipulação de arquivos 'fs'
// e o módulo de cores para console 'colors'
const fs = require("fs");
const colors = require("colors");

// Exporta uma função que recebe o cliente (bot) como parâmetro
module.exports = (client) => {

  // Imprime no console um texto indicando o início do carregamento dos eventos
  console.log("\n" + "[EVENTOS💿] Eventos Handler:".blue);
  
  // Lê a pasta 'events' e para cada subpasta na pasta
  fs.readdirSync('./events/').forEach(dir => {

    // Lista todos os arquivos na subpasta que terminam com '.js'
		const commands = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

    // Para cada arquivo encontrado
		for (let file of commands) {

      // Importa o arquivo para uma variável
			let pull = require(`../events/${dir}/${file}`);

      // Se o arquivo contém o nome do evento
			if (pull.name) {

        // Adiciona o evento ao objeto de eventos do cliente (bot)
				client.events.set(pull.name, pull);

        // Imprime no console que o arquivo foi carregado
				console.log(`┕[HANDLER - EVENTOS💿] Carregou um arquivo: ${pull.name}`.brightGreen)
			} else {
        // Se o arquivo não contém o nome do evento, imprime um aviso no console
				console.log(`┕[HANDLER - EVENTOS💿] Não foi possível carregar o arquivo ${file}. nome ou pseudônimos ausentes.`.red)

        // Continua para o próximo arquivo
				continue;
			}
		}
	});
}