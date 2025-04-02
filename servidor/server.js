const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let tarefas = [];


try {
  const data = fs.readFileSync('tarefas.json', 'utf8');
  tarefas = JSON.parse(data);
} catch (error) {
  console.log('Erro ao ler list.json', error)
  tarefas = [];
}

// teste
app.use(express.json())


// server
app.get('/', (req, res) => {
  res.send('Página Inicial');
})

// visualizar todas tarefas
app.get('/tarefas', (req, res) => {
  res.json(tarefas);
})


// GET visualizar apenas uma tarefa
app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(p => p.id === id);

  if(tarefa) {
    res.json(tarefa)
  }else{
    res.status(404).send('Tarefa não encontrada!!!')
  }
})


// POST postar uma nova tarefa
app.post('/tarefas',(req, res) => {
  const novaTarefa = req.body;
  console.log('Nova tarefa:',novaTarefa);
  res.status(200);
})

app.put('/tarefas/:id',(req, res) => {




// 
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


