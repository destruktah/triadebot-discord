const fs = require('fs');
const path = require('path');
const ascii = require('ascii-table');

async function loadButtons(client) {
  // Cria uma nova instância de ascii-table com o título "Buttons List"
  const table = new ascii('Buttons List');
  
  // Obtém o caminho completo da pasta "buttons"
  const buttonsFolder = path.join(__dirname, '../buttons');

  // Lê o conteúdo da pasta "buttons"
  const files = await fs.promises.readdir(buttonsFolder);

  // Filtra os arquivos que terminam com ".js"
  const jsFiles = files.filter((file) => file.endsWith('.js'));

  // Itera sobre cada arquivo retornado pela função readdir
  jsFiles.forEach((file) => {
    // Obtém o caminho completo do arquivo
    const filePath = path.join(buttonsFolder, file);

    // Importa o botão definido em cada arquivo
    const button = require(filePath);

    // Se o botão não tiver um ID, retorna
    if (!button.id) return;

    // Adiciona o botão ao mapa de botões do cliente com a chave sendo o ID do botão
    client.buttons.set(button.id, button);

    // Define as colunas da tabela
    table.setHeading('Button ID', 'Status');

    // Adiciona uma nova linha à tabela com o ID do botão e uma mensagem de sucesso
    table.addRow(`${button.id}`, '🟩 Success');

    // Exibe o nome do arquivo que foi carregado
    console.log(`Loaded button file: ${file}`);
    console.log(table.toString());
    
  })
}
module.exports = loadButtons ;