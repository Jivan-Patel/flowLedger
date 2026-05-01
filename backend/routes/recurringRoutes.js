import express from 'express'
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurring,
  processRecurring
} from '../controllers/recurringController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getRecurring)
router.post('/', createRecurring)
router.put('/:id', updateRecurring)
router.delete('/:id', deleteRecurring)
router.patch('/:id/toggle', toggleRecurring)
router.post('/process', processRecurring)

export default router
