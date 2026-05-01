import express from 'express'
import { createClient, getClients, deleteClient } from '../controllers/clientController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, createClient)
router.get('/', requireAuth, getClients)
router.delete('/:id', requireAuth, deleteClient)

export default router
