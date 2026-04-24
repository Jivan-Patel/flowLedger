import mongoose from 'mongoose'

export const connectDB = async () => {
	const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowledger'
	await mongoose.connect(mongoUri)
	console.log('Connected to MongoDB')
}
