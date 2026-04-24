import api from './api'

export const cashflowService = {
  getSummary: async () => {
    const response = await api.get('/cashflow/summary')
    return response.data
  },
  getMonthly: async () => {
    const response = await api.get('/cashflow/monthly')
    return response.data
  }
}
