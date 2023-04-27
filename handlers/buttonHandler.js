// Importa as bibliotecas fs, path e colors.
const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Exporta uma função que recebe dois parâmetros: o objeto client e o objeto config.
module.exports = (client, config) => {

    // Imprime uma mensagem no console informando que o Button Handler está sendo iniciado.
    console.log('\n' + '[BOTÃO🔘] Button Handler:'.blue);

    // Obtendo o caminho completo da pasta "buttons"
    const buttonsFolderPath = path.join(__dirname, '..', 'buttons');

    // Lendo os arquivos da pasta "buttons"
    fs.readdirSync(buttonsFolderPath).forEach(file => {

        // Importando o arquivo
        const button = require(path.join(buttonsFolderPath, file));

        // Verifica se o módulo possui um nome especificado na sua configuração.
        if (button.id) {

            // Adiciona o módulo ao objeto de botões do cliente, usando o nome especificado na configuração como chave.
            client.buttons.set(button.id, button);

            // Imprime uma mensagem no console informando que o arquivo foi carregado com sucesso.
            console.log(`┕[HANDLER - BOTÃO🔘] Carregou um arquivo: ${button.id} (#${client.buttons.size})`.brightGreen);

        } else {

            // Imprime uma mensagem no console informando que o arquivo não foi carregado devido à falta do valor do nome do módulo na sua configuração.
            console.log(`┕[HANDLER - BOTÃO🔘] Não foi possível carregar o arquivo ${file}, faltando o valor do nome do módulo.`.red);
        }
    });
};


