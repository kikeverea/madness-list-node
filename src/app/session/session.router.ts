import sessionsController from './session.controller'

import { Router } from 'express'

const router = Router()

router.post('/login', sessionsController.login)
router.get('/logout', sessionsController.logout)

export default router