import chalk from "chalk";
import axios from "axios";
import inquirer from "inquirer";

const API_URL = "http://localhost:3000";
const TOKEN = "SEGREDO";

//
async function listarTarefas() {
  try {
    const res = await axios.get(`${API_URL}/tarefas`);
    return res.data;
  } catch (err) {
    console.error(chalk.red("Erro ao listar tarefas:"), err.message);
  }
}

async function exibirDetalhesTarefa(id) {
  try {
    const res = await axios.get(`${API_URL}/tarefas/${id}`);
    return res.data;
  } catch (err) {
    console.error(chalk.red("Erro ao exibir tarefa:"), err.message);
  }
}

async function criarTarefa() {
  const respostas = await inquirer.prompt([
    { name: "titulo", message: "Título da tarefa:" },
    { name: "descricao", message: "Descrição da tarefa:" },
    { name: "status", message: "Status da tarefa:" }
  ]);

  try {
    const res = await axios.post(`${API_URL}/tarefas`, respostas, {
      headers: { Authorization: TOKEN }
    });
    console.log(chalk.green("Tarefa criada com sucesso!"), res.data);
  } catch (err) {
    console.error(chalk.red("Erro ao criar tarefa:"), err.message);
  }
}

async function atualizarTarefa() {
  const respostas = await inquirer.prompt([
    { name: "id", message: "ID da tarefa a atualizar (PUT):" },
    { name: "titulo", message: "Novo título:" },
    { name: "descricao", message: "Nova descrição:" },
    { name: "status", message: "Novo status:" }
  ]);

  try {
    const res = await axios.put(`${API_URL}/tarefas/${respostas.id}`, {
      titulo: respostas.titulo,
      descricao: respostas.descricao,
      status: respostas.status
    }, {
      headers: { Authorization: TOKEN }
    });

    console.log(chalk.green("Tarefa atualizada com sucesso!"), res.data);
  } catch (err) {
    console.error(chalk.red("Erro ao atualizar tarefa:"), err.message);
  }
}

async function atualizarParcial() {
  const respostas = await inquirer.prompt([
    { name: "id", message: "ID da tarefa a atualizar (PATCH):" },
    { name: "status", message: "Novo status:" }
  ]);

  try {
    const res = await axios.patch(`${API_URL}/tarefas/${respostas.id}`, {
      status: respostas.status
    }, {
      headers: { Authorization: TOKEN }
    });

    console.log(chalk.green("Status atualizado com sucesso!"), res.data);
  } catch (err) {
    console.error(chalk.red("Erro ao atualizar status:"), err.message);
  }
}

async function deletarTarefa() {
  const resposta = await inquirer.prompt([
    { name: "id", message: "ID da tarefa a deletar:" }
  ]);

  try {
    const res = await axios.delete(`${API_URL}/tarefas/${resposta.id}`, {
      headers: { Authorization: TOKEN }
    });

    console.log(chalk.green("Tarefa deletada com sucesso!"), res.data);
  } catch (err) {
    console.error(chalk.red("Erro ao deletar tarefa:"), err.message);
  }
}

// Menu principal
async function exibirMenu() {
  console.clear();
  console.log(chalk.blue.bold("\n==== SISTEMA DE TAREFAS ====\n"));

  const { opcao } = await inquirer.prompt([
    {
      type: "list",
      name: "opcao",
      message: "Escolha uma opção:",
      choices: [
        { name: "Listar tarefas", value: "listar" },
        { name: "Exibir detalhes de uma tarefa", value: "detalhes" },
        { name: "Criar nova tarefa", value: "criar" },
        { name: "Atualizar tarefa (PUT)", value: "atualizar" },
        { name: "Atualizar status (PATCH)", value: "parcial" },
        { name: "Deletar tarefa", value: "deletar" },
        { name: "Sair", value: "sair" }
      ]
    }
  ]);

  switch (opcao) {
    case "listar":
      const tarefas = await listarTarefas();
      if (tarefas && tarefas.length) {
        console.log(chalk.green("\nTarefas:"));
        tarefas.forEach(t =>
          console.log(` - ${t.id}: ${t.titulo} (${t.status})`)
        );
      } else {
        console.log(chalk.yellow("Nenhuma tarefa encontrada."));
      }
      break;

    case "detalhes":
      const { id } = await inquirer.prompt([
        { name: "id", message: "Digite o ID da tarefa:" }
      ]);
      const tarefa = await exibirDetalhesTarefa(id);
      if (tarefa) {
        console.log(chalk.green("\nDetalhes da tarefa:"));
        console.log(tarefa);
      }
      break;

    case "criar":
      await criarTarefa();
      break;

    case "atualizar":
      await atualizarTarefa();
      break;

    case "parcial":
      await atualizarParcial();
      break;

    case "deletar":
      await deletarTarefa();
      break;

    case "sair":
      console.log(chalk.blue("Até mais!"));
      return;
  }

  await inquirer.prompt([{ name: "continue", message: "Pressione Enter para continuar..." }]);
  await exibirMenu();
}

exibirMenu();
