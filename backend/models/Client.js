import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, default: '' },
	userId: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Client', clientSchema)
