import axios from 'axios'

const PROD_API_URL = 'https://flowledger-backend-2yxh.onrender.com'
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : 'http://localhost:5000')

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to attach user email header
api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('flowledger_session')
    if (session) {
      const user = JSON.parse(session)
      if (user && user.email) {
        config.headers['user-email'] = user.email
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
