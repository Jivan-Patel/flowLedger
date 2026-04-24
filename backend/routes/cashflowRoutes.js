import express from 'express'
import { getCashFlowSummary, getMonthlyBreakdown } from '../controllers/cashflowController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/summary', getCashFlowSummary)
router.get('/monthly', getMonthlyBreakdown)

export default router
