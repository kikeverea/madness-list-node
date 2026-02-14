const router = require('express').Router()
const listController = require('./list.controller')
const { setList } = require('./list.middleware')

router.param('id', setList)

router.get('/', listController.findAll)
router.get('/:id', listController.find)
router.post('/', listController.create)
router.put('/:id', listController.update)
router.delete('/:id', listController.destroy)

module.exports = router