import { Router } from 'express'
import listController from './list.controller'
import { setList } from './list.middleware'

const router = Router()

router.param('id', setList)

router.get('/', listController.findAll)
router.get('/:id', listController.find)
router.post('/', listController.create)
router.put('/:id', listController.update)
router.delete('/:id', listController.destroy)

export default router