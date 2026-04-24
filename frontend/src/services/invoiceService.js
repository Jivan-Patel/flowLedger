import api from './api'

export const invoiceService = {
	getInvoices: async (filters = {}) => {
		// Only append query string if filters are provided and have truthy values
		const validFilters = Object.fromEntries(
			Object.entries(filters).filter(([_, v]) => v != null && v !== '')
		)
		const query = new URLSearchParams(validFilters).toString()
		const url = `/invoices${query ? `?${query}` : ''}`
		const response = await api.get(url)
		return response.data
	},
	getInvoice: async (id) => {
		const response = await api.get(`/invoices/${id}`)
		return response.data
	},
	createInvoice: async (data) => {
		const response = await api.post('/invoices', data)
		return response.data
	},
	updateInvoice: async (id, data) => {
		const response = await api.put(`/invoices/${id}`, data)
		return response.data
	},
	deleteInvoice: async (id) => {
		const response = await api.delete(`/invoices/${id}`)
		return response.data
	},
	markPaid: async (id) => {
		const response = await api.patch(`/invoices/${id}/mark-paid`)
		return response.data
	},
	getSummary: async () => {
		const response = await api.get('/invoices/summary')
		return response.data
	}
}
