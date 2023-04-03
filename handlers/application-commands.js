// Importando as dependências necessárias:
const { PermissionsBitField, Routes, REST, User } = require('discord.js');
const fs = require("fs");

module.exports = (client, config) => {
  // Imprimindo mensagem de início da execução do handler de comandos do aplicativo:
  console.log("\n" + "[APPLICATION] Application commands Handler:".blue);

  // Criando um array vazio para armazenar os comandos:
  let commands = [];

  // Handler de comandos de barra (Slash Commands):
  fs.readdirSync('./commands/slash/').forEach((dir) => {
    // Imprimindo mensagem de início da leitura dos comandos de barra:
    console.log("\n" + '[HANDLER📀] Começou a carregar comandos de barra(Slash Commands)...'.yellow);

    // Listando todos os arquivos .js na pasta do tipo de comando atual (slash ou apps):
    const SlashCommands = fs.readdirSync(`./commands/slash/${dir}`).filter((file) => file.endsWith('.js'));

    // Iterando sobre cada arquivo de comando:
    for (let file of SlashCommands) {
      // Carregando o arquivo de comando:
      let pull = require(`../commands/slash/${dir}/${file}`);

      // Verificando se o nome, descrição e tipo do comando estão definidos corretamente:
      if (pull.name, pull.description, pull.type == 1) {
        // Adicionando o comando ao mapa de comandos do bot:
        client.slash_commands.set(pull.name, pull);

        // Imprimindo mensagem informando que o arquivo de comando foi carregado com sucesso:
        console.log(`┕[HANDLER - SLASH📀] Carregou um arquivo: ${pull.name} (#${client.slash_commands.size})`.brightGreen);

        // Adicionando o comando ao array de comandos para posterior registro:
        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
          default_member_permissions: pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
        });
      } else {
        // Imprimindo mensagem de erro caso o nome, descrição ou tipo do comando não estejam definidos corretamente:
        console.log(`┕[HANDLER - SLASH📀] Não foi possível carregar o arquivo ${file}, valor, descrição ou tipo de nome de módulo ausente não é "1" ou "ApplicationCommandType.ChatInput".`.red)
        
        // Continuando para o próximo arquivo:
        continue;
      };
    };
  });

  // Handler de comandos de usuário (User Commands):
  fs.readdirSync('./commands/apps/').forEach((dir) => {
    // Imprimindo mensagem de início da leitura dos comandos de usuário:
    console.log("\n" + '[HANDLER📀] Começou a carregar comandos de apps(User Commands)...'.yellow);

    // Listando todos os arquivos .js na pasta do tipo de comando atual (slash ou apps):
    const UserCommands = fs.readdirSync(`./commands/apps/${dir}`).filter((file) => file.endsWith('.js'));

// Para cada arquivo na matriz UserCommands:
for (let file of UserCommands) {
    // Carrega o arquivo de comando
    let pull = require(`../commands/apps/${dir}/${file}`);

    // Se o nome e o tipo do comando estiverem definidos corretamente (tipo 2):
    if (pull.name, pull.type == 2) {
        // Adiciona o comando ao conjunto de comandos de usuário do cliente
        client.user_commands.set(pull.name, pull);
        // Imprime uma mensagem de sucesso no console com o nome do comando e o número total de comandos de usuário carregados
        console.log(`┕[HANDLER - APPS📀] Carregou um arquivo: ${pull.name} (#${client.user_commands.size})`.brightGreen);

        // Adiciona o comando aos comandos a serem registrados
        commands.push({
            name: pull.name,
            type: pull.type || 2,
        });
    } else {
        // Se o nome ou o tipo do comando não estiverem definidos corretamente, imprime uma mensagem de erro no console e continua para o próximo arquivo
        console.log(`┕[HANDLER - APPS📀] Não foi possível carregar o arquivo ${file}, o valor do nome do módulo ausente ou o tipo não é 2.`.red)
        continue;
    };
};

// Registrando todos os comandos do aplicativo:
// Verifica se o ID do bot está definido em config.js
if (!config.Client.ID) {
    // Se o ID do bot não estiver definido, imprime uma mensagem de erro no console e encerra o processo
    console.log("[CRASH] Você precisa fornecer seu ID de bot em config.js!".red + "\n");
    return process.exit();
};

// Cria um objeto REST para fazer solicitações de API para registrar comandos
const rest = new REST({ version: '10' }).setToken(config.Client.Token);

// Define uma função assíncrona anônima e a executa imediatamente
(async () => {
    // Imprime uma mensagem informando que o registro de comandos começou
    console.log("\n" + '[HANDLER📀] Começou a registrar todos os comandos do aplicativo.'.yellow);

    try {
        // Faz uma solicitação de API para registrar os comandos especificados
        await rest.put(
            Routes.applicationCommands(config.Client.ID),
            { body: commands }
        );

        // Imprime uma mensagem de sucesso no console após o registro bem-sucedido de todos os comandos
        console.log("\n" + '[HANDLER📀] Todos os comandos do aplicativo foram registrados com sucesso.'.brightGreen);
    } catch (err) {
        // Se houver um erro ao registrar os comandos, imprime o erro no console
        console.log(err);
    };
})()})};