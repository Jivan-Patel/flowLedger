import Client from '../models/Client.js'

export const createClient = async (req, res) => {
	try {
		const { name, phone, email } = req.body
		if (!name || !phone) {
			return res.status(400).json({ message: 'Name and phone are required' })
		}
		const client = await Client.create({
			name,
			phone,
			email,
			userId: req.userId
		})
		res.status(201).json(client)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const getClients = async (req, res) => {
	try {
		const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 })
		res.status(200).json(clients)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const deleteClient = async (req, res) => {
	try {
		const { id } = req.params
		await Client.findOneAndDelete({ _id: id, userId: req.userId })
		res.status(200).json({ message: 'Client deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
