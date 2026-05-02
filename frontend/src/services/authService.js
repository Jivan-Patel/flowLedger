const PROD_API_URL = 'https://flowledger-backend-2yxh.onrender.com'
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : 'http://localhost:5000')

export async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }))
  if (!response.ok) {
    throw new Error(data.message || 'Login request failed')
  }

  return data
}

export async function signupRequest(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })

  const data = await response.json().catch(() => ({ success: false, message: 'Invalid server response' }))
  if (!response.ok) {
    throw new Error(data.message || 'Signup request failed')
  }

  return data
}
