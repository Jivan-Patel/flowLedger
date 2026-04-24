import express from 'express'
import {
	getInvoices,
	getInvoiceById,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	markInvoicePaid,
	getInvoiceSummary
} from '../controllers/invoiceController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(requireAuth)

router.get('/summary', getInvoiceSummary)
router.get('/', getInvoices)
router.post('/', createInvoice)
router.get('/:id', getInvoiceById)
router.put('/:id', updateInvoice)
router.delete('/:id', deleteInvoice)
router.patch('/:id/mark-paid', markInvoicePaid)

export default router
