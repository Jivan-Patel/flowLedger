import api from './api'

export const clientService = {
	getClients: async () => {
		const res = await api.get('/clients')
		return res.data
	},
	createClient: async (data) => {
		const res = await api.post('/clients', data)
		return res.data
	},
	deleteClient: async (id) => {
		const res = await api.delete(`/clients/${id}`)
		return res.data
	}
}
