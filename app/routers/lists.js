const router = require('express').Router()

let lists = [
  {
    "id" : "1",
    "name": "To-Do List"
  }
]

router.get('/api/lists', (request, response) => {
  response.json(lists)
})

router.get('/api/lists/:id', (request, response) => {
  const id = request.params.id
  const list = lists.find(list => list.id === id)

  response.json(list)
})

export default router

