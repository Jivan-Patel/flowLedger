import express from 'express'
import {
  getCashFlowSummary,
  getMonthlyBreakdown,
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateThreshold
} from '../controllers/cashflowController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/summary', getCashFlowSummary)
router.get('/monthly', getMonthlyBreakdown)
router.get('/transactions', getTransactions)
router.post('/transactions', createTransaction)
router.delete('/transactions/:id', deleteTransaction)
router.put('/threshold', updateThreshold)

export default router
