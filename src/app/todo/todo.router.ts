import { Router } from 'express'
import todosController from './todo.controller'
import { setTodo } from './todo.middleware'

const router = Router()

router.param('id', setTodo)

router.get('/', todosController.findAll)
router.get('/:id', todosController.find)
router.post('/', todosController.create)
router.put('/:id', todosController.update)
router.delete('/:id', todosController.destroy)

export default router