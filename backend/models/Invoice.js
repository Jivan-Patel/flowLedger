import mongoose from 'mongoose'

const lineItemSchema = new mongoose.Schema({
	description: { type: String, required: true },
	quantity: { type: Number, required: true, min: 1 },
	unitPrice: { type: Number, required: true, min: 0 },
	total: { type: Number }
}, { _id: false })

const invoiceSchema = new mongoose.Schema({
	invoiceNumber: { type: String, required: true, unique: true },
	client: {
		name: { type: String, required: true },
		email: { type: String, default: '' },
		phoneNumber: { type: String, default: '' }
	},
	lineItems: { type: [lineItemSchema], required: true },
	subtotal: { type: Number, default: 0 },
	taxRate: { type: Number, default: 0 },
	taxAmount: { type: Number, default: 0 },
	total: { type: Number, default: 0 },
	status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
	issueDate: { type: Date, default: Date.now },
	dueDate: { type: Date, required: true },
	paidDate: { type: Date, default: null },
	notes: { type: String, default: '' },
	userId: { type: String, required: true }
}, { timestamps: true })

invoiceSchema.pre('save', function (next) {
	this.lineItems.forEach(item => {
		item.total = item.quantity * item.unitPrice
	})
	this.subtotal = this.lineItems.reduce((sum, i) => sum + i.total, 0)
	this.taxAmount = this.subtotal * (this.taxRate / 100)
	this.total = this.subtotal + this.taxAmount
	next()
})

export default mongoose.model('Invoice', invoiceSchema)
