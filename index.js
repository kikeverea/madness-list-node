const express = require('express')
const app = express()

const PORT = 3000

let lists = [
  {
    "id" : "1",
    "name": "To-Do List"
  }
]

let todos = [
  {
    "id": "1",
    "title": "Item 1",
    "completed": true,
    "listId": 1
  },
  {
    "id": "2",
    "title": "Item 2",
    "completed": false,
    "listId":  1
  },
  {
    "id": "3",
    "title": "Item 3",
    "completed": true,
    "listId":  1
  },
]

app.get('/api/lists', (request, response) => {
  response.json(lists)
})

app.get('/api/lists/:id', (request, response) => {
  const id = request.params.id
  const list = lists.find(list => list.id === id)

  response.json(list)
})


// TO-DOS
app.get('/api/todos', (request, response) => {
  response.json(todos)
})

app.get('/api/todos/:id', (request, response) => {
  const id = request.params.id
  const todo = todos.find(todo => todo.id === id)

  if (todo)
    response.json(todo)
  else {
    response.statusMessage = 'Todo not found'
    response.status(404).end()
  }
})

app.post('/api/todos', (request, response) => {
  const body = request.body

  if (body.title) {
    const todo = { ...body, id: todos.length + 1 }
    todos = [ ...todos, todo ]
    response.json(todo)
  }
  else {
    response.statusMessage = 'Title cannot be empty'
    response.status(400).json({ error: 'Title cannot be empty' })
  }
})

app.put('/api/todos/:id', (request, response) => {
  const id = request.params.id
  const todo = todos.find(todo => todo.id === id)

  if (todo) {
    todos = todos.map(inList => inList.id === id ? { ...todo, ...request.body } : inList)
    response.json(todo)
  }
  else {
    response.statusMessage = 'Todo not found'
    response.status(404).end()
  }

  response.status(200).end()
})

app.delete('/api/todos/:id', (request, response) => {
  const id = request.params.id
  todos = todos.filter(todo => todo.id !== id)

  response.status(204).end()
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))