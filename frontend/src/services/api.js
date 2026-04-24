import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
