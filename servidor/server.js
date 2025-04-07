const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let tarefas = [];

try {
  const data = fs.readFileSync('tarefas.json', 'utf8');
  tarefas = JSON.parse(data);
} catch (error) {
  console.log('Erro ao ler tarefas.json:', error);
  tarefas = [];
}

app.use(express.json());

// Middleware
const autenticar = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'SEGREDO') {
    next(); 
  } else {
    res.status(401).json({ erro: 'Não autorizado' });
  }
};

// Função para salvar no arquivo
function salvarTarefas() {
  try {
    fs.writeFileSync('tarefas.json', JSON.stringify(tarefas, null, 2));
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
  }
}

// resgistro de LOG s
function registrarLog(acao, detalhe = '') {
  const timestamp = new Date().toISOString();
  const registro = `[${timestamp}] ${acao} ${detalhe}\n`;

  console.log(registro.trim());
  
  //salvar no logs
  fs.appendFile('logs.txt', registro, (err) => {
    if (err) {
      console.error('Erro ao registrar log:', err);
    }
  });
}


// Página inicial
app.get('/', (req, res) => {
  res.send('Página Inicial');
  res.status(200);
});

// Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
  res.status(200)
});

// Listar tarefa por ID
app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(p => p.id === id);
  if (tarefa) {
    res.json(tarefa);
    res.status(200);
  } else {
    res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
});

// Criar nova tarefa por post
app.post('/tarefas', autenticar, (req, res) => {
  const novaTarefa = req.body;
  novaTarefa.id = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
  tarefas.push(novaTarefa);
  salvarTarefas();
  registrarLog('POST', `Tarefa ID ${novaTarefa.id}`);
  res.status(201).json(novaTarefa);
});

// Atualizar tarefa inteira (PUT)
app.put('/tarefas/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index !== -1) {
    const { id: _, ...dadosAtualizados } = req.body; // 
    tarefas[index] = { ...tarefas[index], ...dadosAtualizados };
    salvarTarefas();
    registrarLog('PUT', `Tarefa ID ${id}`);
    res.json(tarefas[index]);
  } else {
    res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
});

// Atualização parcial por patfch
app.patch('/tarefas/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index !== -1) {
    tarefas[index] = { ...tarefas[index], ...req.body };
    salvarTarefas();
    registrarLog('PATCH', `Tarefa ID ${id}`);
    res.json(tarefas[index]);
  } else {
    res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
});

// Deletar tarefa
app.delete('/tarefas/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index !== -1) {
    const deletada = tarefas.splice(index, 1);
    salvarTarefas();
    registrarLog('DELETE', `Tarefa ID ${id}`);
    res.json(deletada[0]);
  } else {
    res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
});

// OPTIONS 
app.options('/tarefas', (req, res) => {
  res.set('Allow', 'GET, POST, OPTIONS');
  res.sendStatus(204);
});
app.options('/tarefas/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.sendStatus(204);
});

// Iniciar servidor RAIZ
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
