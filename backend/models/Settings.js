import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  cashFlowThreshold: { type: Number, default: 10000 },
  currency: { type: String, default: '₹' },
  businessName: { type: String, default: 'My Business' },
  email: { type: String, default: '' },
  userId: { type: String, required: true, unique: true }
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)
