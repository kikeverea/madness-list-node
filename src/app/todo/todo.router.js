const router = require('express').Router()
const todosController = require('./todo.controller')
const { setTodo } = require('./todo.middleware')

router.param('id', setTodo)

router.get('/', todosController.findAll)
router.get('/:id', todosController.find)
router.post('/', todosController.create)
router.put('/:id', todosController.update)
router.delete('/:id', todosController.destroy)

module.exports = router