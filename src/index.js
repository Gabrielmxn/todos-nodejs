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
    return response.status(404).send({error: "Usuário não encontrado."})
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

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.send(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).send(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline} = request.body;

  const { user } = request;

  const verifyTodo = user.todos.some(todo => todo.id === id)

  if (!verifyTodo){
    return response.status(404).send({ error: "Não existe"});
  }
  const findTodoOfId = user.todos.find(todo => todo.id === id);

  findTodoOfId.title = title;
  findTodoOfId.deadline = new Date(deadline);
  
  return response.send(user)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const verifyTodo = user.todos.some(todo => todo.id === id)

  if (!verifyTodo){
    return response.status(404).send({ error: "Não existe"});
  }

  const findTodoOfId = user.todos.find(todo => todo.id === id);

  findTodoOfId.done = true;

  return response.send(findTodoOfId);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;


  const verifyTodo = user.todos.some(todo => todo.id === id)

  if (!verifyTodo){
    return response.status(404).send({ error: "Não existe"});
  }

  const deleteTodoIfId = user.todos.filter(todo => todo.id !== id);

  user.todos = [...deleteTodoIfId];

  return response.status(204);


});

module.exports = app;