import chalk from "chalk";
import axios from "axios";
import inquirer from "inquirer";

const API_URL = "http://localhost:3000";


// exibir todos
async function listarTarefas() {
  try{
    const response = await axios.get(`${API_URL}/tarefas`);
    return response.data
  }catch (error) {
    console.error(chalk.red('ERRO ao listar Tarefas: '), error.message);
  }
}

// GET exibir por id
async function exibirDetalhesTarefas(id){
  try {
    const response = await axios.get(`${API_URL}/tarefas/${id}`)
    return response.data;
  } catch (error) {
    console.error(chalk.red(`ERRO ao exibir detalhes da tarefa com ID: `), error.message)
    return null;
  }
}

// Exibir menu
async function exibirMenu() {
  console.log('\n\n')
  const perguntas = [
    {
      type: 'list',
      name: 'opcao',
      message: chalk.yellow('Escolha uma opção: '),
      choices: [
        {name: chalk.green('Listar Tarefas'), value:'lista'},
        {name: chalk.green('Exibir detalhes do produto'), value:'exibir'},
        {name: chalk.green('Sair'), value:'sair'},

      ]
    }
  ] 

try {
  const resposta = await inquirer.prompt(perguntas);

  // SWITCH
  switch (resposta.opcao) {
    case 'listar':
      const tarefas = await listarProdutos();

      if (Array.isArray(tarefas) && tarefas.lenght > 0){
        console.log(chalk.green('Listar tarefas: '));

        tarefas.forEach(tarefa => {
          console.log(` - ${chalk.cyan(tarefa.id)}: ${chalk.green(tarefa.titulo)} - ${chalk.yellow(tarefa.descricao)} - ${chalk.blue(tarefa.status)}`)
        });
      }else{
        console.log(chalk.yellow('Nenhum produto encontrado.'));
      }

      exibirMenu();
      break;

      case 'exibir':
        const idResposta = await inquirer.prompt([
          {
            type: 'input',
            name: 'id',
            message: chalk.blue('Digite o ID do produto: ')
          }
        ]);

        const produto = await exibirDetalhesTarefas(idResposta.id);

        if(produto){
          console.log(chalk.green('Detalhes do produto: '));

          console.log(` - ${chalk.cyan(tarefa.id)}: ${chalk.green(tarefa.titulo)} - ${chalk.yellow(tarefa.descricao)} - ${chalk.blue(tarefa.status)}`)
        }else{
          console.log(chalk.blue('Produto não encontrado!'));
        }

        exibirMenu()
      break;
      case 'sair':
        console.log(chalk.blue('Saindo do Sistema...'));
        break;
  }


} catch (error) {
  console.error(chalk.red('Ocorreu um erro inesperado'), error);
}


}
exibirMenu();