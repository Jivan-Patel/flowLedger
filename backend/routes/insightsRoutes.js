import express from 'express'
import { getInsights } from '../controllers/insightsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getInsights)

export default router
