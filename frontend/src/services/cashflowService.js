import api from './api'

export const cashflowService = {
  getSummary: async () => {
    const response = await api.get('/cashflow/summary')
    return response.data
  },
  getMonthly: async () => {
    const response = await api.get('/cashflow/monthly')
    return response.data
  },
  getTransactions: async () => {
    const response = await api.get('/cashflow/transactions')
    return response.data
  },
  createTransaction: async (data) => {
    const response = await api.post('/cashflow/transactions', data)
    return response.data
  },
  deleteTransaction: async (id) => {
    const response = await api.delete(`/cashflow/transactions/${id}`)
    return response.data
  },
  updateThreshold: async (threshold) => {
    const response = await api.put('/cashflow/threshold', { threshold })
    return response.data
  }
}
