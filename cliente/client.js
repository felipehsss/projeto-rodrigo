import chalk from "chalk";
import axios from "axios";
import inquirer from "inquirer";

const API_URL = "http://localhost:3000";

// Exibir todas as tarefas
async function listarTarefas() {
  try {
    const response = await axios.get(`${API_URL}/tarefas`);
    return response.data;
  } catch (error) {
    console.error(chalk.red('ERRO ao listar Tarefas: '), error.message);
  }
}

// Exibir detalhes de uma tarefa por ID
async function exibirDetalhesTarefas(id) {
  try {
    const response = await axios.get(`${API_URL}/tarefas/${id}`);
    return response.data;
  } catch (error) {
    console.error(chalk.red(`ERRO ao exibir detalhes da tarefa com ID: `), error.message);
    return null;
  }
}

// Exibir menu principal
async function exibirMenu() {
  console.log('\n\n');
  const perguntas = [
    {
      type: 'list',
      name: 'opcao',
      message: chalk.yellow('Escolha uma opção: '),
      choices: [
        { name: chalk.green('Listar Tarefas'), value: 'listar' },
        { name: chalk.green('Exibir detalhes da tarefa'), value: 'exibir' },
        { name: chalk.green('Sair'), value: 'sair' },
      ]
    }
  ];

  try {
    const resposta = await inquirer.prompt(perguntas);

    switch (resposta.opcao) {
      case 'listar':
        const tarefas = await listarTarefas();
        if (Array.isArray(tarefas) && tarefas.length > 0) {
          console.log(chalk.green('Lista de Tarefas:'));
          tarefas.forEach(tarefa => {
            console.log(` - ${chalk.cyan(tarefa.id)}: ${chalk.green(tarefa.titulo)} - ${chalk.yellow(tarefa.descricao)} - ${chalk.blue(tarefa.status)}`);
          });
        } else {
          console.log(chalk.yellow('Nenhuma tarefa encontrada.'));
        }
        exibirMenu();
        break;

      case 'exibir':
        const idResposta = await inquirer.prompt([
          {
            type: 'input',
            name: 'id',
            message: chalk.blue('Digite o ID da tarefa: ')
          }
        ]);

        const tarefa = await exibirDetalhesTarefas(idResposta.id);
        if (tarefa) {
          console.log(chalk.green('Detalhes da tarefa:'));
          console.log(` - ${chalk.cyan(tarefa.id)}: ${chalk.green(tarefa.titulo)} - ${chalk.yellow(tarefa.descricao)} - ${chalk.blue(tarefa.status)}`);
        } else {
          console.log(chalk.blue('Tarefa não encontrada!'));
        }
        exibirMenu();
        break;

      case 'sair':
        console.log(chalk.blue('Saindo do Sistema...'));
        break;
    }
  } catch (error) {
    console.error(chalk.red('Ocorreu um erro inesperado'), error);
  }
}

// Iniciar o menu
exibirMenu();
