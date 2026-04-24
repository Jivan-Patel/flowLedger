import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
	description: { type: String, required: true },
	amount: { type: Number, required: true, min: 0 },
	type: { type: String, enum: ['income', 'expense'], required: true },
	date: { type: Date, default: Date.now },
	category: { type: String, default: 'General' },
	isRecurring: { type: Boolean, default: false },
	recurringId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringTransaction', default: null },
	userId: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
