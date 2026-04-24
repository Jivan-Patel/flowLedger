import Invoice from '../models/Invoice.js'

export const getInvoices = async (req, res) => {
	try {
		const { status, client, sortBy = 'createdAt', order = 'desc' } = req.query
		const query = { userId: req.userId }
		if (client) query['client.name'] = { $regex: client, $options: 'i' }

		const sortOrder = order === 'asc' ? 1 : -1
		const sortParams = { [sortBy]: sortOrder }

		const invoices = await Invoice.find(query).sort(sortParams)

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		let processedInvoices = invoices.map(inv => {
			const invObj = inv.toObject()
			if (invObj.status !== 'paid') {
				const due = new Date(invObj.dueDate)
				due.setHours(0, 0, 0, 0)
				if (due < today) {
					invObj.status = 'overdue'
					invObj.daysOverdue = Math.floor((today - due) / (1000 * 60 * 60 * 24))
				} else {
					invObj.status = 'pending'
					invObj.daysOverdue = 0
				}
			}
			return invObj
		})

		if (status && status !== 'all') {
			processedInvoices = processedInvoices.filter(inv => inv.status === status)
		}

		res.status(200).json(processedInvoices)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const getInvoiceById = async (req, res) => {
	try {
		const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.userId })
		if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
		res.status(200).json(invoice)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const createInvoice = async (req, res) => {
	try {
		const count = await Invoice.countDocuments({ userId: req.userId })
		const now = new Date()
		const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
		const invoiceNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`

		const invoice = new Invoice({
			...req.body,
			invoiceNumber,
			userId: req.userId
		})

		await invoice.save()
		res.status(201).json(invoice)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

export const updateInvoice = async (req, res) => {
	try {
		const invoice = await Invoice.findOneAndUpdate(
			{ _id: req.params.id, userId: req.userId },
			req.body,
			{ new: true }
		)
		if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
		res.status(200).json(invoice)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

export const deleteInvoice = async (req, res) => {
	try {
		const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.userId })
		if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
		res.status(200).json({ message: 'Invoice deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const markInvoicePaid = async (req, res) => {
	try {
		const invoice = await Invoice.findOneAndUpdate(
			{ _id: req.params.id, userId: req.userId },
			{ status: 'paid', paidDate: new Date() },
			{ new: true }
		)
		if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
		res.status(200).json(invoice)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

export const getInvoiceSummary = async (req, res) => {
	try {
		const invoices = await Invoice.find({ userId: req.userId })
		const now = new Date()
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		let overdueTotal = 0, overdueCount = 0
		let pendingTotal = 0, pendingCount = 0
		let collectedThisMonth = 0, collectedThisMonthCount = 0
		let paidCount = 0

		invoices.forEach(inv => {
			let status = inv.status
			if (status !== 'paid') {
				const due = new Date(inv.dueDate)
				due.setHours(0, 0, 0, 0)
				status = due < today ? 'overdue' : 'pending'
			}

			if (status === 'overdue') {
				overdueTotal += inv.total
				overdueCount++
			} else if (status === 'pending') {
				pendingTotal += inv.total
				pendingCount++
			} else if (status === 'paid') {
				paidCount++
				if (inv.paidDate && new Date(inv.paidDate) >= startOfMonth) {
					collectedThisMonth += inv.total
					collectedThisMonthCount++
				}
			}
		})

		res.status(200).json({
			overdueTotal, overdueCount,
			pendingTotal, pendingCount,
			collectedThisMonth, collectedThisMonthCount,
			paidCount, totalCount: invoices.length
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
