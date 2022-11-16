const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username );

  if(!user){
    return response.status(400).send({error: "Usuário não encontrado."})
  }

  request.user = user;
  
  return next()
}

app.post('/users', (request, response) => {
  const { name, username} = request.body;

  const verifyIfUsernameExist = users.some(user => user.username === username)


  if(verifyIfUsernameExist){
    return response.status(400).send({error: "Usuário já existe"});
  }

  const newUser = {
    id: uuidv4(), 
    name,
    username,
    todos: []
  }

  users.push(newUser);

  return response.send(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.send(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;