import { Router } from 'express'
import usersController from './user.controller'
import { setUser } from './user.middleware'

const router = Router()

router.param('id', setUser)

router.get('/', usersController.findAll)
router.get('/me', usersController.me)
router.get('/:id', usersController.find)
router.post('/', usersController.create)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.destroy)

export default router