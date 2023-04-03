// Importa a biblioteca fs, que é usada para trabalhar com arquivos do sistema de arquivos.
const fs = require("fs");

// Importa a biblioteca colors, que é usada para formatar as mensagens de console.
const colors = require("colors");

// Exporta uma função que recebe dois parâmetros: o objeto client e o objeto config.
module.exports = (client, config) => {

    // Imprime uma mensagem no console informando que o Prefix Handler está sendo iniciado.
    console.log("\n" + "[PREFIXO📌] Prefix Handler:".blue);

    // Lê todos os diretórios contidos na pasta "commandsPrefix" usando a função readdirSync.
    fs.readdirSync('./commandsPrefix/').forEach(local => {

        // Lê todos os arquivos com extensão ".js" de cada diretório encontrado na pasta "commandsPrefix".
        const comandos = fs.readdirSync(`./commandsPrefix/${local}`).filter(arquivo => arquivo.endsWith('.js'))

        // Loop através de cada arquivo encontrado na pasta "commandsPrefix".
        for(let file of comandos) {

            // Importa o módulo que foi encontrado no loop atual.
            let puxar= require(`../commandsPrefix/${local}/${file}`)

            // Verifica se o módulo possui um nome especificado na sua configuração.
            if(puxar.config.name) {

                // Adiciona o módulo ao objeto de comandos do cliente, usando o nome especificado na configuração como chave.
                client.commands.set(puxar.config.name, puxar)

                // Verifica se o módulo possui aliases especificados na sua configuração, e se sim, adiciona eles ao objeto de aliases do cliente.
                if(puxar.config.aliases && Array.isArray(puxar.config.aliases))
                    puxar.config.aliases.forEach(x => client.aliases.set(x, puxar.config.name))

                // Imprime uma mensagem no console informando que o arquivo foi carregado com sucesso.
                console.log(`┕[HANDLER - PREFIXO📌] Carregou um arquivo: ${puxar.config.name} (#${client.commands.size})`.brightGreen)
            
            } else {

                // Imprime uma mensagem no console informando que o arquivo não foi carregado devido à falta do valor do nome do módulo na sua configuração.
                console.log(`┕[HANDLER - PREFIXO📌] Não foi possível carregar o arquivo ${file}, faltando o valor do nome do módulo.`.red)

                // Continua para o próximo loop sem executar o código abaixo.
                continue;

            };
        } 
    });
};