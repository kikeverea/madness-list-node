import express from "express";

const router = express.Router()

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

router.get('/api/todos', (request, response) => {
  response.json(todos)
})

router.get('/api/todos/:id', (request, response) => {
  const id = request.params.id
  const todo = todos.find(todo => todo.id === id)

  if (todo)
    response.json(todo)
  else {
    response.statusMessage = 'Todo not found'
    response.status(404).end()
  }
})

router.post('/api/todos', (request, response) => {
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

router.put('/api/todos/:id', (request, response) => {
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

router.delete('/api/todos/:id', (request, response) => {
  const id = request.params.id
  todos = todos.filter(todo => todo.id !== id)

  response.status(204).end()
})

export default router