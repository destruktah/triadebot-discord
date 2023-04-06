// Importa a classe QuickDB do módulo quick.db
const { QuickDB } = require("quick.db");

// Importa o cliente Discord criado em ../index.js
const client = require("../../index");

// Importa o objeto de configuração definido em ../../config/config.js
const config = require("../../config/config.js");

// Cria uma nova instância de QuickDB para ser usada como um banco de dados
const db = new QuickDB();

const { InteractionType } = require('discord.js');
// Exporta um objeto com o nome "interactionCreate" (usado em outros arquivos)
module.exports = {
   name: "interactionCreate"
};

// Evento chamado sempre que uma interação é criada (como um comando de chat, menu de contexto, etc)
client.on('interactionCreate', async (interaction) => {
    // Verifica se a interação é um comando de chat
    if (interaction.isChatInputCommand()) {
        // Obtém o comando apropriado para o nome do comando da interação
        const command = client.slash_commands.get(interaction.commandName);
        // Se o comando não existe, retorna
        if (!command) return;

        try {
            // Executa o comando com o cliente, a interação, a configuração e o banco de dados
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        };
    };

    // Verifica se a interação é um comando de menu de contexto do usuário
    if (interaction.isUserContextMenuCommand()) { // UserCommand:
        // Obtém o comando apropriado para o nome do comando da interação
        const command = client.user_commands.get(interaction.commandName);
        // Se o comando não existe, retorna
        if (!command) return;

        try {
            // Executa o comando com o cliente, a interação, a configuração e o banco de dados
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        };
    };

    // Verifica se a interação é um comando de menu de contexto da mensagem
    if (interaction.isMessageContextMenuCommand()) { // MessageCommmad:
        // Obtém o comando apropriado para o nome do comando da interação
        const command = client.message_commands.get(interaction.commandName);
        // Se o comando não existe, retorna
        if (!command) return;

        try {
            // Executa o comando com o cliente, a interação, a configuração e o banco de dados
            command.run(client, interaction, config, db);
        } catch (e) {
            console.error(e)
        };
    };

    if (interaction.type == InteractionType.ModalSubmit) { // MessageCommmad:
        console.log('utilizador pressionou o botao enviar do formulario')
        const { modals } = client;
        const { customId } = interaction;
        const modal = modals.get(customId);
        
        if (!modal) return new Error("Nao existe codigo para este modal.");

        try {
            await modal.run(client, interaction, config, db);
            console.log(modal);
        } catch (e) {
            console.error(e)
        };
    };
});