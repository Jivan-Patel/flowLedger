import api from './api'

export const insightsService = {
	getInsights: async () => {
		const res = await api.get('/insights')
		return res.data
	}
}
